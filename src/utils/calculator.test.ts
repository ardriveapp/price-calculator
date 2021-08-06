import { GatewayOracle } from 'ardrive-core-js';
import type { ArweaveOracle } from 'ardrive-core-js/lib/arweave_oracle';
import { expect } from 'chai';
import { SinonSpiedInstance, spy } from 'sinon';
import { Calculator } from './calculator';

const someValidByteCount = 1000; // 1KB

describe('Ar<>Data calculator', () => {
	let spyedOracle: SinonSpiedInstance<ArweaveOracle>;
	let calculator: Calculator;

	before(() => {
		spyedOracle = spy(new GatewayOracle());
		calculator = new Calculator(spyedOracle);
	});

	it('Zero oracle calls when just constructed', () => {
		expect(spyedOracle.getWinstonPriceForByteCount.callCount === 0);
	});

	it('Undefined estimation if not setted up', () => {
		const estimation = calculator.getPriceForBytes(someValidByteCount);
		expect(typeof estimation === 'undefined');
	});

	it('Three oracle calls when setted up', async () => {
		await calculator.setup();
		return expect(spyedOracle.getWinstonPriceForByteCount.callCount === 3);
	});

	it('The returned estimation value is a number', async () => {
		const estimation = await calculator.getPriceForBytes(someValidByteCount);
		return expect(typeof estimation === 'number');
	});
});
