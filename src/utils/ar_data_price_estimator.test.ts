import { GatewayOracle } from './gateway_oracle';
import type { ArweaveOracle } from './arweave_oracle';
import { expect } from 'chai';
import { SinonStubbedInstance, stub } from 'sinon';
import { ARDataPriceEstimator } from './ar_data_price_estimator';
import { expectAsyncErrorThrow } from './test_helpers';

describe('ARDataPriceEstimator class', () => {
	let spyedOracle: SinonStubbedInstance<ArweaveOracle>;
	let calculator: ARDataPriceEstimator;

	before(() => {
		// Set pricing algo up as x = y (bytes = Winston)
		spyedOracle = stub(new GatewayOracle());
		spyedOracle.getWinstonPriceForByteCount.callsFake((input) => Promise.resolve(input));
		calculator = new ARDataPriceEstimator(true, spyedOracle);
	});

	it('can be instantiated without making oracle calls', async () => {
		const gatewayOracleStub = stub(new GatewayOracle());
		gatewayOracleStub.getWinstonPriceForByteCount.callsFake(() => Promise.resolve(123));
		new ARDataPriceEstimator(true, gatewayOracleStub);
		expect(gatewayOracleStub.getWinstonPriceForByteCount.notCalled).to.be.true;
	});

	it('makes 3 oracle calls during routine instantiation', async () => {
		const gatewayOracleStub = stub(new GatewayOracle());
		gatewayOracleStub.getWinstonPriceForByteCount.callsFake(() => Promise.resolve(123));
		new ARDataPriceEstimator(false, gatewayOracleStub);
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

		it('makes three oracle calls after the first price estimation request', async () => {
			await calculator.getByteCountForWinston(0);
			expect(spyedOracle.getWinstonPriceForByteCount.calledThrice).to.be.true;
		});
	});

	it('getByteCountForAR function returns the expected value', async () => {
		const actualByteCountEstimation = await calculator.getByteCountForAR(0.000_000_000_100);
		expect(actualByteCountEstimation).to.equal(100);
	});

	it('getARPriceForByteCount function returns the expected value', async () => {
		const actualByteCountEstimation = await calculator.getARPriceForByteCount(100);
		expect(actualByteCountEstimation).to.equal(0.000_000_000_100);
	});
});
