import { Fetcher, JSFetcher } from './fetcher';
import { TurboRates } from './turbo_rates';

export class TurboRatesOracle implements RatesOracle {
	constructor(private readonly fetcher: Fetcher = new JSFetcher()) {}

	public async getTurboRates(): Promise<TurboRates> {
		const queryUrl = this.getQueryRequestUrl();
		const fetchResponse = await this.fetcher.fetch(queryUrl);
		const responseData = await fetchResponse.json();

		const rates: TurboRates = new TurboRates(responseData.winc, responseData.fiat);

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

export abstract class RatesOracle {
	public abstract getTurboRates(): Promise<TurboRates>;
	public abstract getQueryRequestUrl(): string;
}
