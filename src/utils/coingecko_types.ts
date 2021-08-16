import type { FiatID, TokenID } from './fiat_oracle_types';

export interface CoinGeckoResponse {
	/**
	 * Whether the response status code returned a successful code (>200 && <300).
	 */
	success: boolean;
	/**
	 * The response status message
	 */
	message: string;
	/**
	 * The response status code
	 */
	code: number;
	/**
	 * The body data in JSON format from the request.
	 */
	data: any;
}

export interface CoinGeckoPriceRequestParams extends Record<string, string> {
	// CSV of the coin IDs
	ids: string;
	// CSV of the fiat currencies to be quoted in
	vs_currencies: string;
}

export type CoinGeckoPriceResponseData = {
	[token in TokenID]: CoinGeckoCoinValue;
};

type CoinGeckoCoinValue = {
	[currency in FiatID]: number;
};

/* The below values were retrived from the CoinGecko API on Friday 13 of August.
 * $ curl -X 'GET' \
 *   'https://api.coingecko.com/api/v3/simple/supported_vs_currencies' \
 *   -H 'accept: application/json'
 */
const coinGeckoSupportedVSCurrencies = [
	'btc',
	'eth',
	'ltc',
	'bch',
	'bnb',
	'eos',
	'xrp',
	'xlm',
	'link',
	'dot',
	'yfi',
	'usd',
	'aed',
	'ars',
	'aud',
	'bdt',
	'bhd',
	'bmd',
	'brl',
	'cad',
	'chf',
	'clp',
	'cny',
	'czk',
	'dkk',
	'eur',
	'gbp',
	'hkd',
	'huf',
	'idr',
	'ils',
	'inr',
	'jpy',
	'krw',
	'kwd',
	'lkr',
	'mmk',
	'mxn',
	'myr',
	'ngn',
	'nok',
	'nzd',
	'php',
	'pkr',
	'pln',
	'rub',
	'sar',
	'sek',
	'sgd',
	'thb',
	'try',
	'twd',
	'uah',
	'vef',
	'vnd',
	'zar',
	'xdr',
	'xag',
	'xau',
	'bits',
	'sats'
] as const;

const coinGeckoSupportedTokens = ['arweave'] as const;

export type CoinGeckoTokenId = typeof coinGeckoSupportedTokens[number];
export type CoinGeckoVSCurrency = typeof coinGeckoSupportedVSCurrencies[number];
