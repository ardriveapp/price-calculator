import { GatewayOracle } from './gateway_oracle';
import type { ArweaveOracle } from './arweave_oracle';
import { expect } from 'chai';
import { SinonStubbedInstance, spy, stub } from 'sinon';
import { Calculator } from './calculator';

const testPoints = [
	// [bytes, winstom]
	[1_000, 2_061_216],
	[1_000_000, 491_171_616],
	[1_000_000_000, 489_601_571_616]
];

const someValidByteCount = testPoints[0][0];

describe('Ar<>Data calculator', () => {
	let spyedOracle: SinonStubbedInstance<ArweaveOracle>;
	let calculator: Calculator;

	before(() => {
		spyedOracle = stub(new GatewayOracle());
		spyedOracle.getWinstonPriceForByteCount.onCall(0).resolves(51_706_656);
		spyedOracle.getWinstonPriceForByteCount.onCall(1).resolves(51_339_852_576);
		spyedOracle.getWinstonPriceForByteCount.onCall(2).resolves(52_570_401_274_656);
		calculator = new Calculator(true, spyedOracle);
	});

	it('Zero oracle calls when just constructed', () => {
		expect(spyedOracle.getWinstonPriceForByteCount.callCount).to.equal(0);
	});

	it('Three oracle calls after the first price estimation request', async () => {
		await calculator.getPriceForBytes(someValidByteCount);
		return expect(spyedOracle.getWinstonPriceForByteCount.callCount).to.equal(3);
	});

	it('The example values are correct', async () => {
		const results = await testPoints.forEach(async (point) => {
			const bytesCount = point[0];
			const winstonPrice = point[1];
			const estimation = await calculator.getPriceForBytes(bytesCount);
			return expect(estimation).to.equal(winstonPrice);
		});
		return results;
	});
});
