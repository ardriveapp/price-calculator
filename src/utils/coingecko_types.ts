export interface CoinGeckoPriceRequestParams extends Record<string, string> {
	// CSV of the coin IDs
	ids: string;
	// CSV of the fiat currencies to be quoted in
	vs_currencies: string;
}

export type CustomPriceDataResponse<
	T extends CoinGeckoTokenId,
	F extends CoinGeckoVSCurrency
> = CoinGeckoPriceResponseData<T, F>;

export type CoinGeckoPriceResponseData<T extends CoinGeckoTokenId, F extends CoinGeckoVSCurrency> = {
	[token in T]: CoinGeckoRates<F>;
};

type CoinGeckoRates<F extends CoinGeckoVSCurrency> = {
	[currency in F]: number;
};

/* The below values were retrieved from the CoinGecko API on August 13 of 2021.
 * $ curl -X 'GET' \
 *   'https://api.coingecko.com/api/v3/simple/supported_vs_currencies' \
 *   -H 'accept: application/json'
 */
export const coinGeckoSupportedVSCurrencies = [
	'usd',
	'jpy',
	'eur',
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
	'gbp',
	'hkd',
	'huf',
	'idr',
	'ils',
	'inr',
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
