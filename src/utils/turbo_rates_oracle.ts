import {
	TurboFactory,
	TurboRatesResponse,
	TurboUnauthenticatedClient
} from '@ardrive/turbo-sdk';

export class TurboRatesOracle implements RatesOracle {
	constructor(
		private turbo: TurboUnauthenticatedClient = TurboFactory.unauthenticated()
	) {}

	public async getTurboRates(): Promise<TurboRatesResponse> {
		return this.turbo.getFiatRates();
	}
}

export abstract class RatesOracle {
	public abstract getTurboRates(): Promise<TurboRatesResponse>;
}
