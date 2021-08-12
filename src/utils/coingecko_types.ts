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
	// CSV of the fiat currencies to be quited in
	vs_currencies: string;
}

export interface CoinGeckoPriceResponseData {
	arweave: {
		usd: number;
	};
}
