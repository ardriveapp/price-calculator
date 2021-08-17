import type { FiatOracle } from './fiat_oracle';
import type { CoinGeckoPriceRequestParams, CoinGeckoPriceResponseData } from './coingecko_types';
import { TokenFiatPair, TokenFiatRate } from './token_fiat_price';
import type { FiatID, TokenID } from './fiat_oracle_types';

const pollingIntervalMilliseconds = 1000 * 60 * 15; // 15 min

function cachePairFilterFactory(pair: TokenFiatPair) {
	return (rate: TokenFiatRate) => rate.fiat === pair.fiat && rate.token === pair.token;
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

export class TokenToFiatOracle implements FiatOracle {
	private cachedPrices: TokenFiatRate[] = [];
	private cacheTimestamp = 0;
	private syncPromise?: Promise<void>;

	/**
	 * @param {FiatID[]} fiats The currency IDs to quote tokens in
	 * @param {TokenID[]} tokens The token ID of the requested coin
	 * @param {number} cacheLifespan Milliseconds that has to pass until the cache is invalid
	 * @param {@link fetch} _fetch The standard fetch method. Defined here for testing propuses
	 * @return {TokenToFiatOracle} A class representing the oracle for the selected currencies
	 */
	constructor(
		private readonly fiats: FiatID[] = ['usd'],
		private readonly tokens: TokenID[] = ['arweave'],
		private readonly cacheLifespan = pollingIntervalMilliseconds,
		private readonly _fetch = fetch
	) {}

	private get currentlyFetchingPrice(): boolean {
		return !!this.syncPromise;
	}

	private get tokensCSV(): string {
		return this.tokens.join(',');
	}

	private get fiatCSV(): string {
		return this.fiats.join(',');
	}

	private get shouldRefreshCacheData(): boolean {
		const currentTimestamp = Date.now();
		const deltaTimestamp = currentTimestamp - this.cacheTimestamp;
		return deltaTimestamp >= this.cacheLifespan;
	}

	/**
	 * @param {FiatID} fiat The fiat currency ID
	 * @param {TokenID} token The token ID
	 * @throws {@link Error} If no such pair cached
	 * @returns {Promise<TokenToFiatPrice>} The cached price value
	 */
	public async getPriceForFiatTokenPair(pair: TokenFiatPair): Promise<TokenFiatRate> {
		await this.checkCache();
		const pricePair = this.cachedPrices.find(cachePairFilterFactory(pair));
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
		const queryUrl = this.getQueryRequestUrl();
		const fetchResponse = await this._fetch(queryUrl);
		const responseData: CoinGeckoPriceResponseData = await fetchResponse.json();
		this.fiats.forEach((fiat) => {
			this.tokens.forEach((token) => {
				const priceValue = responseData[token][fiat];
				this.updateCachePair(new TokenFiatPair(fiat, token), priceValue);
			});
		});
	}

	private updateCachePair(pair: TokenFiatPair, rate: number): void {
		/* It is safe to pop, then push the element as javascript is single-threaded */
		try {
			this.popSingleCachePair(pair);
		} finally {
			const updatedPrice = new TokenFiatRate(pair.fiat, pair.token, rate);
			this.cachedPrices.push(updatedPrice);
		}
	}

	private popSingleCachePair(pair: TokenFiatPair): TokenFiatRate {
		const cachePairIndex = this.cachedPrices.findIndex(cachePairFilterFactory(pair));
		if (cachePairIndex === -1) {
			throw new Error(`Pair not found`);
		}
		const cachePairPrice = this.cachedPrices.splice(cachePairIndex, 1)[0];
		return cachePairPrice;
	}

	private getQueryRequestUrl(): string {
		const params: CoinGeckoPriceRequestParams = {
			ids: this.tokensCSV,
			vs_currencies: this.fiatCSV
		};
		const parsedParams = new URLSearchParams(params).toString();
		const queryUrl = `https://api.coingecko.com/api/v3/simple/price?${parsedParams}`;
		return queryUrl;
	}
}
