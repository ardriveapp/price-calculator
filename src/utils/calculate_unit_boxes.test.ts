import { expect } from 'chai';
import { SinonStubbedInstance, stub } from 'sinon';
import type { UnitBoxValues } from '../hooks/useCalculation';
import { ARDataPriceRegressionEstimator } from './ar_data_price_regression_estimator';
import { UnitBoxCalculator } from './calculate_unit_boxes';
import type { ARDataPriceEstimator } from './ar_data_price_estimator';
import type { ArDriveCommunityTip } from '../types';
import type { FiatOracle } from './fiat_oracle';
import { CachingTokenToFiatOracle } from './caching_token_to_fiat_oracle';
import { CoinGeckoTokenToFiatOracle } from './coingecko_token_to_fiat_oracle';
import { currencyIDs } from './fiat_oracle_types';

describe('UnitBoxCalculator class', () => {
	let unitBoxCalculator: UnitBoxCalculator;
	let cachingTokenToOracle: CachingTokenToFiatOracle;

	let stubbedPriceEstimator: SinonStubbedInstance<ARDataPriceEstimator>;
	let stubbedCoinGeckoOracle: SinonStubbedInstance<FiatOracle>;

	const expectedResult: UnitBoxValues = { bytes: 1, fiat: 10, ar: 1 };

	const arDriveCommunityTip: ArDriveCommunityTip = { minWinstonFee: 10, tipPercentage: 0.15 };

	before(() => {
		stubbedPriceEstimator = stub(new ARDataPriceRegressionEstimator(true));
		stubbedPriceEstimator.getByteCountForAR.callsFake((v) => Promise.resolve(v * Math.pow(2, 10)));
		stubbedPriceEstimator.getARPriceForByteCount.callsFake(() => Promise.resolve(1));

		stubbedCoinGeckoOracle = stub(new CoinGeckoTokenToFiatOracle());
		stubbedCoinGeckoOracle.getFiatRatesForToken.callsFake(() =>
			Promise.resolve([{ token: 'arweave', fiat: 'usd', fiatPerTokenRate: 10 }])
		);

		cachingTokenToOracle = new CachingTokenToFiatOracle('arweave', currencyIDs, 2000, stubbedCoinGeckoOracle);

		unitBoxCalculator = new UnitBoxCalculator(stubbedPriceEstimator, cachingTokenToOracle);
	});

	it('fiatOracle getter returns the correct oracle', () => {
		expect(unitBoxCalculator.fiatOracle).to.deep.equal(cachingTokenToOracle);
	});

	describe('calculateUnitBoxValues function ', () => {
		it('returns the correct UnitBoxValues for 0 bytes', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(0, 'bytes', 'usd', 'KB', arDriveCommunityTip);
			expect(actual.unitBoxValues).to.deep.equal({ bytes: 0, fiat: 0, ar: 0 });
		});

		it('returns the correct unitBoxes when using the bytes unit to calculate', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(1, 'bytes', 'usd', 'KB', arDriveCommunityTip);
			expect(actual.unitBoxValues).to.deep.equal(expectedResult);
		});

		it('returns the correct unitBoxes when using the fiat unit to calculate', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(10, 'fiat', 'usd', 'KB', arDriveCommunityTip);
			expect(actual.unitBoxValues).to.deep.equal(expectedResult);
		});

		it('returns the correct unitBoxes when using the ar unit to calculate', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(1, 'ar', 'usd', 'KB', arDriveCommunityTip);
			expect(actual.unitBoxValues).to.deep.equal(expectedResult);
		});

		it('returns an arToData error when using the `getARPriceForByteCount` method and the ARDataPriceEstimator fails to fetch AR<>Data pricing estimates', async () => {
			stubbedPriceEstimator.getARPriceForByteCount.throws();
			unitBoxCalculator = new UnitBoxCalculator(stubbedPriceEstimator, cachingTokenToOracle);

			const actual = await unitBoxCalculator.calculateUnitBoxValues(1, 'bytes', 'usd', 'KB', arDriveCommunityTip);

			expect(actual.oracleErrors.dataToAR).to.be.true;
		});

		it('returns an arToData error when using the `getByteCountForAR` method and the ARDataPriceEstimator fails to fetch AR<>Data pricing estimates', async () => {
			stubbedPriceEstimator.getByteCountForAR.throws();
			unitBoxCalculator = new UnitBoxCalculator(stubbedPriceEstimator, cachingTokenToOracle);

			const actual = await unitBoxCalculator.calculateUnitBoxValues(1, 'ar', 'usd', 'KB', arDriveCommunityTip);

			expect(actual.oracleErrors.dataToAR).to.be.true;
		});

		it('returns a fiatToData error when the `getPriceForFiatTokenPair` method fails to retrieve the fiatPerAR price from the CachingTokenToFiatOracle', async () => {
			stubbedCoinGeckoOracle.getFiatRatesForToken.throws();
			cachingTokenToOracle = new CachingTokenToFiatOracle('arweave', currencyIDs, 2000, stubbedCoinGeckoOracle);

			unitBoxCalculator = new UnitBoxCalculator(stubbedPriceEstimator, cachingTokenToOracle);

			const actual = await unitBoxCalculator.calculateUnitBoxValues(1, 'bytes', 'usd', 'KB', arDriveCommunityTip);

			expect(actual.oracleErrors.fiatToAR).to.be.true;
		});
	});
});
