import { expect } from 'chai';
import convertBytes from './convertBytes';

describe('The convertBytes function', () => {
	it('correctly converts bytes to KB', () => {
		expect(convertBytes(1_000, 'KB')).to.equal(0.9765625);
	});

	it('correctly converts bytes to MB', () => {
		expect(convertBytes(1_000_000, 'MB')).to.equal(0.953_674_316_406_25);
	});

	it('correctly converts bytes to GB', () => {
		expect(convertBytes(1_000_000_000, 'GB')).to.equal(0.931_322_574_615_478_5);
	});

	it('correctly converts KB to bytes', () => {
		expect(convertBytes(1, 'KB', true)).to.equal(1_024);
	});

	it('correctly converts MB to bytes', () => {
		expect(convertBytes(1, 'MB', true)).to.equal(1_048_576);
	});

	it('correctly converts GB to bytes', () => {
		expect(convertBytes(1, 'GB', true)).to.equal(1_073_741_824);
	});

	it('returns correctly with a negative byteCount', () => {
		expect(convertBytes(-1_000, 'KB')).to.equal(-0.9765625);
	});

	it('returns correctly with a byteCount set to the maximum safe integer', () => {
		expect(convertBytes(Number.MAX_SAFE_INTEGER, 'GB')).to.equal(8388607.999999999);
	});
});
