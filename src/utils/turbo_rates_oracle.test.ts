import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { SinonStubbedInstance, stub } from 'sinon';
import type { FiatID } from './fiat_oracle_types';
import { TurboRatesOracle } from './turbo_rates_oracle';
import { TurboRates } from './turbo_rates';
import { Fetcher, JSFetcher } from './fetcher';

chai.use(chaiAsPromised);

const fiat: FiatID = 'usd';
const examplePriceValue = 15.05;

const turboRatesResponseSample = `{
	"winc": 1,
	"fiat": {
		"${fiat}": ${examplePriceValue}
	}
}`;

const myCustomResponse: Response = {
	async json(): Promise<string> {
		return JSON.parse(turboRatesResponseSample);
	}
} as Response;

describe('The TurboRatesOracle class', () => {
	let stubbedFetcher: SinonStubbedInstance<Fetcher>;
	let turboRatesOracle: TurboRatesOracle;

	beforeEach(() => {
		stubbedFetcher = stub(new JSFetcher());
		stubbedFetcher.fetch.callsFake(async () => myCustomResponse);
		turboRatesOracle = new TurboRatesOracle(stubbedFetcher);
	});

	it('does not perform a fetch when oracle is initialized', () => {
		expect(stubbedFetcher.fetch.callCount).to.equal(0);
	});

	describe('getQueryRequestUrl function', () => {
		it('generates the correct URL', async () => {
			expect(turboRatesOracle.getQueryRequestUrl()).to.equal('https://payment.ardrive.dev/v1/rates');
		});
	});

	describe('getFiatRatesForToken function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await turboRatesOracle.getTurboRates()).to.deep.equal(
				new TurboRates(1, {
					[fiat]: examplePriceValue
				})
			);
			expect(stubbedFetcher.fetch.callCount).to.equal(1);
		});
	});
});
