import { GatewayOracle } from './gateway_oracle';
import type { ArweaveOracle } from './arweave_oracle';
import { expect } from 'chai';
import { SinonStubbedInstance, stub } from 'sinon';
import { ARDataPriceRegressionEstimator } from './ar_data_price_regression_estimator';
import { expectAsyncErrorThrow } from './test_helpers';
import type { ArDriveCommunityTip } from '../types';

describe('ARDataPriceEstimator class', () => {
	let spyedOracle: SinonStubbedInstance<ArweaveOracle>;
	let calculator: ARDataPriceRegressionEstimator;

	const arDriveCommunityTip: ArDriveCommunityTip = { minWinstonFee: 10, tipPercentage: 0.15 };

	beforeEach(() => {
		// Set pricing algo up as x = y (bytes = Winston)
		// TODO: Get ts-sinon working with snowpack so we don't have to use a concrete type here
		spyedOracle = stub(new GatewayOracle());
		spyedOracle.getWinstonPriceForByteCount.callsFake((input) => Promise.resolve(input));
		calculator = new ARDataPriceRegressionEstimator(true, spyedOracle);
	});

	it('can be instantiated without making oracle calls', async () => {
		const gatewayOracleStub = stub(new GatewayOracle());
		gatewayOracleStub.getWinstonPriceForByteCount.callsFake(() => Promise.resolve(123));
		new ARDataPriceRegressionEstimator(true, gatewayOracleStub);
		expect(gatewayOracleStub.getWinstonPriceForByteCount.notCalled).to.be.true;
	});

	it('makes 3 oracle calls during routine instantiation', async () => {
		const gatewayOracleStub = stub(new GatewayOracle());
		gatewayOracleStub.getWinstonPriceForByteCount.callsFake(() => Promise.resolve(123));
		new ARDataPriceRegressionEstimator(false, gatewayOracleStub);
		expect(gatewayOracleStub.getWinstonPriceForByteCount.calledThrice).to.be.true;
	});

	it('makes three oracle calls after the first price estimation request', async () => {
		await calculator.getWinstonPriceForByteCount(0);
		expect(spyedOracle.getWinstonPriceForByteCount.calledThrice).to.be.true;
	});

	it('getWinstonPriceForByteCount function returns the expected value', async () => {
		const actualWinstonPriceEstimation = await calculator.getWinstonPriceForByteCount(100);
		expect(actualWinstonPriceEstimation).to.equal(100);
	});

	describe('getByteCountForWinston function', () => {
		it('returns the expected value', async () => {
			const actualByteCountEstimation = await calculator.getByteCountForWinston(100);
			expect(actualByteCountEstimation).to.equal(100);
		});

		it('throws an error when provided winston value is a negative integer', async () => {
			await expectAsyncErrorThrow(() => calculator.getByteCountForWinston(-1));
		});

		it('throws an error when provided winston value is represented as a decimal', async () => {
			await expectAsyncErrorThrow(() => calculator.getByteCountForWinston(0.1));
		});

		it('makes three oracle calls after the first price estimation request', async () => {
			await calculator.getByteCountForWinston(0);
			expect(spyedOracle.getWinstonPriceForByteCount.calledThrice).to.be.true;
		});
	});

	describe('getByteCountForAR function', () => {
		it('returns the expected value', async () => {
			const actualByteCountEstimation = await calculator.getByteCountForAR(
				0.000_000_000_100,
				arDriveCommunityTip
			);
			expect(actualByteCountEstimation).to.equal(85);
		});

		it('returns 0 if estimation does not cover the minimum winston fee', async () => {
			const actualByteCountEstimation = await calculator.getByteCountForAR(
				0.000_000_000_010,
				arDriveCommunityTip
			);
			expect(actualByteCountEstimation).to.equal(0);
		});
	});

	it('getARPriceForByteCount function returns the expected value', async () => {
		const actualARPriceEstimation = await calculator.getARPriceForByteCount(100, arDriveCommunityTip);

		expect(actualARPriceEstimation).to.equal(0.000_000_000_115);
	});

	describe('refreshPriceData function', () => {
		it('avoids duplicate oracle calls', async () => {
			const expected = await calculator.refreshPriceData();
			const actual = await calculator.refreshPriceData();

			expect(actual).to.equal(expected);
			expect(spyedOracle.getWinstonPriceForByteCount.calledThrice).to.be.true;
		});
	});
});
