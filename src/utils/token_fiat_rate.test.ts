import { expect } from 'chai';
import { TokenFiatRate } from './token_fiat_rate';
import { beforeEach, describe, it } from 'vitest';

describe('The TokenFiatRate class', () => {
	it('constructor throws an error when a negative rate is provided', async () => {
		expect(() => new TokenFiatRate('arweave', 'usd', -1)).to.throw(Error);
	});

	it('constructs and returns expected data', async () => {
		const actual = new TokenFiatRate('arweave', 'usd', 0.5);
		expect(actual.token).to.equal('arweave');
		expect(actual.fiat).to.equal('usd');
		expect(actual.fiatPerTokenRate).to.equal(0.5);
	});
});
