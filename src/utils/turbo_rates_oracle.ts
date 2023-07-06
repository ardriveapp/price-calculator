import { FiatRates, TurboRates } from './turbo_rates';

export interface Fetcher {
	fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response>;
}

export class JSFetcher implements Fetcher {
	fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
		return fetch(input, init);
	}
}

export class TurboRatesOracle {
	constructor(private readonly fetcher: Fetcher = new JSFetcher()) {}

	public async getTurboRates(): Promise<TurboRates> {
		const queryUrl = this.getQueryRequestUrl();
		const fetchResponse = await this.fetcher.fetch(queryUrl);
		const responseData = await fetchResponse.json();

		const rates: TurboRates = new TurboRates(
			responseData.winc,
			new FiatRates(
				responseData.fiat.aud,
				responseData.fiat.brl,
				responseData.fiat.cad,
				responseData.fiat.eur,
				responseData.fiat.gbp,
				responseData.fiat.hkd,
				responseData.fiat.inr,
				responseData.fiat.jpy,
				responseData.fiat.sgd,
				responseData.fiat.usd
			)
		);

		return rates;
	}

	/**
	 * Exposed as public for testing propuses
	 */
	public getQueryRequestUrl(): string {
		const queryUrl = `https://payment.ardrive.dev/v1/rates`;
		return queryUrl;
	}
}
