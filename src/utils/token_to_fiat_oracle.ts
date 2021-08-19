import type { FiatOracle } from './fiat_oracle';
import type { CoinGeckoPriceRequestParams, CoinGeckoPriceResponseData } from './coingecko_types';
import { TokenFiatPair, TokenFiatRate } from './token_fiat_price';
import {
	FiatID,
	FiatIDToThirdParty,
	fiatIdToThirdParty,
	TokenID,
	TokenIDToThirdParty,
	tokenIdToThirdParty
} from './fiat_oracle_types';

const COMMA_SEPARATOR = ',';
const pollingIntervalMilliseconds = 1000 * 60 * 15; // 15 min

function isValidData<T>(d: unknown): d is T {
	// FIXME: please actually assert the structure of d to be a CoinGeckoPriceResponseData
	return !!d;
}

function pairFilterFactory<T extends TokenID, F extends FiatID>(pair: TokenFiatPair<T, F>) {
	return (p: TokenFiatPair<any, any>) => p.token === pair.token && p.fiat === pair.fiat;
}

/*
 * The CoinGecko wrapper does not support browser.
 * Here it is the reported feature request for supporting
 * the browser platform by just removing node dependencies.
 *
 * https://github.com/miscavage/CoinGecko-API/issues/19
 *
 * When the report is taken and fixed, please:
 * 1. Import the CoinGecko wrapper.
 * 2. Define a CoinGecko client as private readonly at the
 *   constructor arguments. So we can test it.
 * 3. On each call to the API, replace the fetch for the actual
 *   API call.
 *
 * Examples
 *
 * 1. import CoinGecko from 'coingecko-api'
 * 2. constructor(private readonly client = new CoinGecko()) {}
 * 3. const response = await this.client.ping() // for the ping() function
 *    const response = await this.client.simple.price(params) // for getting the price of a currency
 */

export class TokenToFiatOracle<T extends TokenID, F extends FiatID> implements FiatOracle<T, F> {
	// private readonly pair: TokenFiatPair<F, T>;
	private data?: CoinGeckoPriceResponseData<TokenIDToThirdParty<T>, FiatIDToThirdParty<F>>;
	private fetchPromise?: Promise<void>;

	constructor(
		private readonly tokens: T[],
		private readonly fiats: F[],
		private readonly maxRetyCount = 0,
		skipFetch = false
	) {
		// this.pair = new TokenFiatPair<F, T>(fiats, tokens);
		if (!skipFetch) {
			this.fetchPairRatesRetry();
		}
	}

	private get tokensCSV(): string {
		return this.tokens.map(tokenIdToThirdParty).join(COMMA_SEPARATOR);
	}

	private get fiatsCSV(): string {
		return this.fiats.map(fiatIdToThirdParty).join(COMMA_SEPARATOR);
	}

	/**
	 * @param {TokenFiatPair} pair
	 * @throws {@link Error} If all the retry fails
	 * @returns {Promise<TokenToFiatPrice>} The cached price value
	 */
	public async getPriceForFiatTokenPair(pair: TokenFiatPair<T, F>): Promise<TokenFiatRate<T, F>> {
		if (!isValidData<CoinGeckoPriceResponseData<TokenIDToThirdParty<T>, FiatIDToThirdParty<F>>>(this.data)) {
			await this.fetchPairRatesRetry();
		}
		if (isValidData<CoinGeckoPriceResponseData<TokenIDToThirdParty<T>, FiatIDToThirdParty<F>>>(this.data)) {
			const thirdPartyTokenId = tokenIdToThirdParty(pair.token);
			const thirdPartyFiatId = fiatIdToThirdParty(pair.fiat);
			const allRates = this.data[thirdPartyTokenId];
			const price = allRates[thirdPartyFiatId];
			const rateInstance = new TokenFiatRate(pair.token, pair.fiat, price);
			return rateInstance;
		} else {
			throw new Error(`Could not get price`);
		}
	}

	public reset(): void {
		this.data = undefined;
	}

	private async fetchPairRatesRetry(): Promise<void> {
		const fetchPromise = new Promise<void>((resolve, reject) => {
			let count = 0;
			let thePromiseString = this.fetchPairRates();
			do {
				thePromiseString = thePromiseString.catch(() => {
					if (
						count < this.maxRetyCount &&
						!isValidData<CoinGeckoPriceResponseData<TokenIDToThirdParty<T>, FiatIDToThirdParty<F>>>(
							this.data
						)
					) {
						return this.fetchPairRates();
					} else {
						reject();
					}
				});
				count++;
			} while (count <= this.maxRetyCount);
			thePromiseString = thePromiseString.then(() => {
				resolve();
			});
		});
		await fetchPromise;
	}

	private async fetchPairRates(): Promise<void> {
		if (isValidData<CoinGeckoPriceResponseData<TokenIDToThirdParty<T>, FiatIDToThirdParty<F>>>(this.data)) {
			return this.fetchPromise;
		}
		const queryUrl = this.getQueryRequestUrl();
		const fetchResponse = await fetch(queryUrl);
		const responseData: CoinGeckoPriceResponseData<
			TokenIDToThirdParty<T>,
			FiatIDToThirdParty<F>
		> = await fetchResponse.json();
		this.data = responseData;
	}

	private getQueryRequestUrl(): string {
		const params: CoinGeckoPriceRequestParams = {
			ids: this.tokensCSV,
			vs_currencies: this.fiatsCSV
		};
		const parsedParams = new URLSearchParams(params).toString();
		const queryUrl = `https://api.coingecko.com/api/v3/simple/price?${parsedParams}`;
		return queryUrl;
	}
}

export class CachingTokenToFiatOracle<T extends TokenID, F extends FiatID> implements FiatOracle<T, F> {
	private cachedRates: TokenFiatRate<T, F>[] = [];
	private cacheTimestamp = 0;
	private syncPromise?: Promise<void>;

	/**
	 * @param {FiatID[]} fiats The currency IDs to quote tokens in
	 * @param {TokenID[]} tokens The token ID of the requested coin
	 * @param {number} cacheLifespan Milliseconds that has to pass until the cache is invalid
	 * @param {TokenToFiatOracle} fiatOracle
	 * @return {CachingTokenToFiatOracle} A class representing the oracle for the selected currencies
	 */
	constructor(
		private readonly tokens: T[],
		private readonly fiats: F[],
		private readonly cacheLifespan = pollingIntervalMilliseconds,
		maxRetryCount = 0,
		private readonly fiatOracle: FiatOracle<T, F> = new TokenToFiatOracle(tokens, fiats, maxRetryCount)
	) {}

	private get currentlyFetchingPrice(): boolean {
		return !!this.syncPromise;
	}

	private get shouldRefreshCacheData(): boolean {
		const currentTimestamp = Date.now();
		const deltaTimestamp = currentTimestamp - this.cacheTimestamp;
		return deltaTimestamp >= this.cacheLifespan;
	}

	/**
	 * @param {FiatID} pair
	 * @throws {@link Error} If no such pair cached
	 * @returns {Promise<TokenToFiatPrice>} The cached price value
	 */
	public async getPriceForFiatTokenPair(pair: TokenFiatPair<T, F>): Promise<TokenFiatRate<T, F>> {
		await this.checkCache();
		const pricePair = this.cachedRates.find(pairFilterFactory(pair)) as TokenFiatRate<T, F> | undefined;
		if (!pricePair) {
			throw new Error(`No such pair (${pair.fiat}, ${pair.token})`);
		}
		return pricePair;
	}

	public reset(): void {
		this.fiatOracle.reset();
	}

	private async checkCache(): Promise<void> {
		if (this.currentlyFetchingPrice) {
			return this.syncPromise;
		}
		if (this.shouldRefreshCacheData) {
			this.fiatOracle.reset();
			this.syncPromise = this.refreshPrices();
		}
	}

	private async refreshPrices(): Promise<void> {
		const allRatePromises: Promise<void>[] = [];
		this.tokens.forEach((token) => {
			this.fiats.forEach((fiat) => {
				const pair = new TokenFiatPair(token, fiat);
				allRatePromises.push(
					this.fiatOracle.getPriceForFiatTokenPair(pair).then((rate) => {
						this.updateCachePair(rate);
					})
				);
			});
		});
		await Promise.all(allRatePromises);
	}

	private updateCachePair<Token extends T, Fiat extends F>(updatedRate: TokenFiatRate<Token, Fiat>): void {
		const rateIndex = this.cachedRates.findIndex(pairFilterFactory(updatedRate));
		this.cachedRates.splice(rateIndex, 1, updatedRate);
	}
}
