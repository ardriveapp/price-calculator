import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import type { FiatID } from './fiat_oracle_types';
import { TurboRatesOracle } from './turbo_rates_oracle';
import { beforeEach, describe, it } from 'vitest';

chai.use(chaiAsPromised);

const fiat: FiatID = 'usd';
const examplePriceValue = 15.05;

const TurboRatesResponseSample = `{
	"winc": 1,
	"fiat": {
		"${fiat}": ${examplePriceValue}
	}
}`;
describe('The TurboRatesOracle class', () => {
	let turboRatesOracle: TurboRatesOracle;

	beforeEach(() => {
		turboRatesOracle = new TurboRatesOracle();
	});

	describe('getFiatRatesForToken function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await turboRatesOracle.getTurboRates()).to.deep.equal(
				TurboRatesResponseSample
			);
		});
	});
});
