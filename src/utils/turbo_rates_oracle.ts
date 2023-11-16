import { TurboFactory, TurboRatesResponse } from '@ardrive/turbo-sdk';

export class TurboRatesOracle implements RatesOracle {
	private turbo = TurboFactory.unauthenticated();

	public async getTurboRates(): Promise<TurboRatesResponse> {
		return this.turbo.getFiatRates();
	}
}

export abstract class RatesOracle {
	public abstract getTurboRates(): Promise<TurboRatesResponse>;
}
