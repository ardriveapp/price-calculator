import { expect } from 'chai';
import { SinonStubbedInstance, stub } from 'sinon';
import type { UnitBoxValues } from '../hooks/useCalculation';
import { UnitBoxCalculator } from './calculate_unit_boxes';
import type { FiatOracle } from './fiat_oracle';
import { CachingTokenToFiatOracle } from './caching_token_to_fiat_oracle';
import { CoinGeckoTokenToFiatOracle } from './coingecko_token_to_fiat_oracle';
import { currencyIDs } from './fiat_oracle_types';
import {
	ARDataPriceChunkEstimator,
	ArDriveCommunityTip,
	W,
	ByteCount,
	AR
} from 'ardrive-core-js';
import { RatesOracle, TurboRatesOracle } from './turbo_rates_oracle';
import { CachingTurboRatesOracle } from './caching_turbo_rates_oracle';
import { beforeAll, describe, it } from 'vitest';
import { TurboRatesResponse } from '@ardrive/turbo-sdk';

describe('UnitBoxCalculator class', () => {
	let unitBoxCalculator: UnitBoxCalculator;
	let cachingTokenToOracle: CachingTokenToFiatOracle;
	let cachingTurboRatesOracle: CachingTurboRatesOracle;

	let stubbedPriceEstimator: SinonStubbedInstance<ARDataPriceChunkEstimator>;
	let stubbedCoinGeckoOracle: SinonStubbedInstance<FiatOracle>;
	let stubbedTurboRatesOracle: SinonStubbedInstance<RatesOracle>;

	const expectedResult: UnitBoxValues = { bytes: 1, fiat: 10, ar: 1 };

	const arDriveCommunityTip: ArDriveCommunityTip = {
		minWinstonFee: W(10),
		tipPercentage: 0.15
	};

	beforeAll(() => {
		stubbedPriceEstimator = stub(new ARDataPriceChunkEstimator(true));
		stubbedPriceEstimator.getByteCountForAR.callsFake((v) =>
			Promise.resolve(new ByteCount(+v * Math.pow(2, 10)))
		);
		stubbedPriceEstimator.getARPriceForByteCount.callsFake(() =>
			Promise.resolve(AR.from(1))
		);

		stubbedCoinGeckoOracle = stub(
			new CoinGeckoTokenToFiatOracle()
		) as unknown as SinonStubbedInstance<FiatOracle>;
		stubbedCoinGeckoOracle.getFiatRatesForToken.callsFake(() =>
			Promise.resolve([
				{ token: 'arweave', fiat: 'usd', fiatPerTokenRate: 10 }
			])
		);

		stubbedTurboRatesOracle = stub(new TurboRatesOracle());
		stubbedTurboRatesOracle.getTurboRates.callsFake(() =>
			Promise.resolve({
				winc: '1',
				fiat: {
					usd: 10
				}
			} as TurboRatesResponse)
		);

		cachingTokenToOracle = new CachingTokenToFiatOracle(
			'arweave',
			currencyIDs,
			2000,
			stubbedCoinGeckoOracle
		);
		cachingTurboRatesOracle = new CachingTurboRatesOracle(
			2000,
			stubbedTurboRatesOracle
		);
		unitBoxCalculator = new UnitBoxCalculator(
			stubbedPriceEstimator,
			cachingTokenToOracle
		);
	});

	it('fiatOracle getter returns the correct oracle', () => {
		expect(unitBoxCalculator.fiatOracle).to.deep.equal(
			cachingTokenToOracle
		);
	});

	describe('calculateUnitBoxValues function ', () => {
		it('returns the correct UnitBoxValues for 0 bytes', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(
				0,
				'bytes',
				'usd',
				'KB',
				'AR',
				arDriveCommunityTip
			);
			expect(actual.unitBoxValues).to.deep.equal({
				bytes: 0,
				fiat: 0,
				ar: 0
			});
		});

		it('returns the correct unitBoxes when using the bytes unit to calculate', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(
				1,
				'bytes',
				'usd',
				'KB',
				'AR',
				arDriveCommunityTip
			);
			expect(actual.unitBoxValues).to.deep.equal(expectedResult);
		});

		it('returns the correct unitBoxes when using the fiat unit to calculate', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(
				10,
				'fiat',
				'usd',
				'KB',
				'AR',
				arDriveCommunityTip
			);
			expect(actual.unitBoxValues).to.deep.equal(expectedResult);
		});

		it('returns the correct unitBoxes when using the ar unit to calculate', async () => {
			const actual = await unitBoxCalculator.calculateUnitBoxValues(
				1,
				'ar',
				'usd',
				'KB',
				'AR',
				arDriveCommunityTip
			);
			expect(actual.unitBoxValues).to.deep.equal(expectedResult);
		});

		it('returns an arToData error when using the `getARPriceForByteCount` method and the ARDataPriceEstimator fails to fetch AR<>Data pricing estimates', async () => {
			stubbedPriceEstimator.getARPriceForByteCount.throws();
			unitBoxCalculator = new UnitBoxCalculator(
				stubbedPriceEstimator,
				cachingTokenToOracle
			);

			const actual = await unitBoxCalculator.calculateUnitBoxValues(
				1,
				'bytes',
				'usd',
				'KB',
				'AR',
				arDriveCommunityTip
			);

			expect(actual.oracleErrors.dataToAR).to.be.true;
		});

		it('returns an arToData error when using the `getByteCountForAR` method and the ARDataPriceEstimator fails to fetch AR<>Data pricing estimates', async () => {
			stubbedPriceEstimator.getByteCountForAR.throws();
			unitBoxCalculator = new UnitBoxCalculator(
				stubbedPriceEstimator,
				cachingTokenToOracle
			);

			const actual = await unitBoxCalculator.calculateUnitBoxValues(
				1,
				'ar',
				'usd',
				'KB',
				'AR',
				arDriveCommunityTip
			);

			expect(actual.oracleErrors.dataToAR).to.be.true;
		});

		it('returns a fiatToData error when the `getPriceForFiatTokenPair` method fails to retrieve the fiatPerAR price from the CachingTokenToFiatOracle', async () => {
			stubbedCoinGeckoOracle.getFiatRatesForToken.throws();
			stubbedTurboRatesOracle.getTurboRates.throws();

			cachingTokenToOracle = new CachingTokenToFiatOracle(
				'arweave',
				currencyIDs,
				2000,
				stubbedCoinGeckoOracle
			);
			cachingTurboRatesOracle = new CachingTurboRatesOracle(
				2000,
				stubbedTurboRatesOracle
			);

			unitBoxCalculator = new UnitBoxCalculator(
				stubbedPriceEstimator,
				cachingTokenToOracle,
				cachingTurboRatesOracle
			);

			const actual = await unitBoxCalculator.calculateUnitBoxValues(
				1,
				'bytes',
				'usd',
				'KB',
				'AR',
				arDriveCommunityTip
			);

			expect(actual.oracleErrors.fiatToAR).to.be.true;
		});
	});
});
