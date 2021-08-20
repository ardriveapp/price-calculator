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

import type { FiatOracle } from './fiat_oracle';
import type { FiatID, TokenID } from './fiat_oracle_types';
import type { TokenFiatPair } from './token_fiat_pair';
import { TokenFiatRate } from './token_fiat_rate';

const COMMA_SEPARATOR = ',';

export interface Fetcher {
	fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response>;
}

export class JSFetcher implements Fetcher {
	fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
		return fetch(input, init);
	}
}

export class CoinGeckoTokenToFiatOracle implements FiatOracle {
	constructor(private readonly fetcher: Fetcher = new JSFetcher()) {}

	public async getFiatRatesForToken(token: TokenID, fiats: FiatID[]): Promise<TokenFiatRate[]> {
		const allRates: TokenFiatRate[] = [];
		const queryUrl = this.getQueryRequestUrl(token, fiats);
		const fetchResponse = await this.fetcher.fetch(queryUrl);
		const responseData: { [t in TokenID]: { [f in FiatID]: number } } = await fetchResponse.json();
		(Object.keys(responseData) as TokenID[]).forEach((token) => {
			const fiats = responseData[token];
			(Object.keys(fiats) as FiatID[]).forEach((fiat) => {
				const rate = fiats[fiat];
				allRates.push(new TokenFiatRate(token, fiat, rate));
			});
		});
		return allRates;
	}

	/**
	 * @param {TokenFiatPair} pair The specific pair you want to query
	 * @returns {Promise<TokenToFiatPrice>} The cached price value
	 */
	public async getPriceForFiatTokenPair(pair: TokenFiatPair): Promise<TokenFiatRate> {
		const rates = await this.getFiatRatesForToken(pair.token, [pair.fiat]);
		return rates[0];
	}

	/**
	 * Exposed as public for testing propuses
	 */
	public getQueryRequestUrl(token: TokenID, fiats: FiatID[]): string {
		if (!fiats.length) {
			throw new Error('Fiats must be provided!');
		}

		const params = {
			ids: token,
			vs_currencies: fiats.join(COMMA_SEPARATOR)
		};
		const parsedParams = new URLSearchParams(params).toString();
		const queryUrl = `https://api.coingecko.com/api/v3/simple/price?${parsedParams}`;
		return queryUrl;
	}
}
