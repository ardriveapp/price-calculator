import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import { TurboRatesOracle } from './turbo_rates_oracle';
import { beforeEach, describe, it } from 'vitest';
import {
	TurboUnauthenticatedClient,
	TurboRatesResponse
} from '@ardrive/turbo-sdk';

const turboStubbedResponse: TurboRatesResponse = {
	winc: '10000',
	fiat: {
		aud: 10.123,
		brl: 10.123,
		cad: 10.123,
		eur: 10.123,
		gbp: 10.123,
		hkd: 10.123,
		inr: 10.123,
		jpy: 10.123,
		sgd: 10.123,
		usd: 10.123
	},
	adjustments: []
};

chai.use(chaiAsPromised);

describe('The TurboRatesOracle class', () => {
	let turboRatesOracle: TurboRatesOracle;
	let turboSpy: TurboUnauthenticatedClient;

	beforeEach(() => {
		turboSpy = sinon.createStubInstance(TurboUnauthenticatedClient, {
			getFiatRates: Promise.resolve(turboStubbedResponse)
		});
		turboRatesOracle = new TurboRatesOracle(turboSpy);
	});

	describe('getFiatRatesForToken function', () => {
		it('returns the expected response from turbo', async () => {
			const rates = await turboRatesOracle.getTurboRates();
			expect(rates).to.deep.equal(turboStubbedResponse);
			expect((turboSpy.getFiatRates as sinon.SinonStub).calledOnce).to.be
				.true;
		});
	});
});
