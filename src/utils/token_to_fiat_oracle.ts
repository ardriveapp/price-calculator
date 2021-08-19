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

const pollingIntervalMilliseconds = 1000 * 60 * 15; // 15 min

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

export class TokenToFiatOracle<F extends FiatID, T extends TokenID> implements FiatOracle {
	private readonly pair: TokenFiatPair<F, T>;

	constructor(private readonly fiat: F, private readonly token: T) {
		this.pair = new TokenFiatPair<F, T>(fiat, token);
	}

	public async getPriceForFiatTokenPair(): Promise<TokenFiatRate<F, T>> {
		const pricesData = await this.fetchPairRate();
		const thirdPartyTokenId = tokenIdToThirdParty(this.token);
		const thirdPartyFiatId = fiatIdToThirdParty(this.fiat);
		const allRates = pricesData[thirdPartyTokenId];
		const price = allRates[thirdPartyFiatId];
		const rateInstance = new TokenFiatRate(this.fiat, this.token, price);
		return rateInstance;
	}

	private async fetchPairRate(): Promise<CoinGeckoPriceResponseData<FiatIDToThirdParty<F>, TokenIDToThirdParty<T>>> {
		console.log('Fetching prices');
		const queryUrl = this.getQueryRequestUrl();
		const fetchResponse = await fetch(queryUrl);
		console.log('Done fetching');
		const responseData: CoinGeckoPriceResponseData<
			FiatIDToThirdParty<F>,
			TokenIDToThirdParty<T>
		> = await fetchResponse.json();
		return responseData;
	}

	private getQueryRequestUrl(): string {
		const params: CoinGeckoPriceRequestParams = {
			ids: tokenIdToThirdParty(this.token),
			vs_currencies: fiatIdToThirdParty(this.fiat)
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
	public async getPriceForFiatTokenPair<Token extends T, Fiat extends F>(
		pair: TokenFiatPair<Token, Fiat>
	): Promise<TokenFiatRate<Token, Fiat>> {
		await this.checkCache();
		const pricePair = this.cachedRates.find(pairFilterFactory(pair)) as TokenFiatRate<Token, Fiat> | undefined;
		if (!pricePair) {
			throw new Error(`No such pair (${pair.fiat}, ${pair.token})`);
		}
		return pricePair;
	}

	private async checkCache(): Promise<void> {
		if (this.currentlyFetchingPrice) {
			return this.syncPromise;
		}
		if (this.shouldRefreshCacheData) {
			this.syncPromise = this.fetchPrices();
			await this.syncPromise;
			delete this.syncPromise;
		}
	}

	private async fetchPrices(): Promise<void> {
		const rate = await this.fiatOracle.getPriceForFiatTokenPair();
		this.updateCachePair(rate.rate);
	}

	private updateCachePair(rate: number): void {
		const updatedPrice = new TokenFiatRate<F, T>(this.fiat, this.token, rate);
		this.cachedRate = updatedPrice;
	}
}
