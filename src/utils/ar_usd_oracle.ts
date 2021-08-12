import type { FiatOracle } from './fiat_oracle';
// import CoinGecko from 'coingecko-api';
import type { CoinGeckoPriceRequestParams, CoinGeckoPriceResponseData, CoinGeckoResponse } from './coingecko_types';

const AR_COIN_ID = 'arweave';
const USD_COIN_ID = 'usd';
const pollingIntervalTime = 1000 * 60 * 15; // 15min expressed in in ms

export class AR_USDOracle implements FiatOracle {
	private cachedPrice = 0;
	private cacheTimestamp = 0;
	private syncPromise?: Promise<void>;

	// constructor(private readonly client = new CoinGecko()) {}

	private get currentlyFetchingPrice() {
		return !!this.syncPromise;
	}

	public async ping(): Promise<boolean> {
		// const response = await this.client.ping();
		const response = await fetch('https://api.coingecko.com/api/v3/ping');
		return response.ok;
	}

	public async getUSDPriceForARAmount(ARAmount: number): Promise<number> {
		const currentTimestamp = Date.now();
		const deltaTimestapm = currentTimestamp - this.cacheTimestamp;
		if (deltaTimestapm >= pollingIntervalTime) {
			await this.syncUSDPriceOfAR();
		}
		return ARAmount * this.cachedPrice;
	}

	private async syncUSDPriceOfAR(): Promise<void> {
		if (this.currentlyFetchingPrice) {
			return this.syncPromise;
		}
		const params: CoinGeckoPriceRequestParams = {
			ids: AR_COIN_ID,
			vs_currencies: USD_COIN_ID
		};

		/*
		 * The CoinGecko wrapper does not support browser
		 * Replace for the simple api call when it does
		 *
		 * https://github.com/miscavage/CoinGecko-API/issues/19
		 */

		// const response = await this.client.simple.price(params);

		// STARTS fetch request
		const parsedParams = new URLSearchParams(params).toString;
		const queryUrl = `https://api.coingecko.com/api/v3/simple/price?${parsedParams}`;
		const fetchResponse = await fetch(queryUrl);
		const response: CoinGeckoResponse = await fetchResponse.json();
		// ENDS fetch request

		const responseData: CoinGeckoPriceResponseData = JSON.parse(response.data);
		const usdPrice = responseData.arweave.usd;
		this.cachedPrice = usdPrice;
		delete this.syncPromise;
	}
}
