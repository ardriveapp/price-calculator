import { expect } from 'chai';
import convertBytes from './convert_unit';

describe('The convertBytes function', () => {
	it('correctly converts bytes to KB', () => {
		expect(convertBytes(Math.pow(2, 10), 'B', 'KB')).to.equal(1);
	});

	it('correctly converts bytes to MB', () => {
		expect(convertBytes(Math.pow(2, 20), 'B', 'MB')).to.equal(1);
	});

	it('correctly converts bytes to GB', () => {
		expect(convertBytes(Math.pow(2, 30), 'B', 'GB')).to.equal(1);
	});

	it('correctly converts KB to bytes', () => {
		expect(convertBytes(1, 'KB', 'B')).to.equal(Math.pow(2, 10));
	});

	it('correctly converts MB to bytes', () => {
		expect(convertBytes(1, 'MB', 'B')).to.equal(Math.pow(2, 20));
	});

	it('correctly converts GB to bytes', () => {
		expect(convertBytes(1, 'GB', 'B')).to.equal(Math.pow(2, 30));
	});

	it('correctly converts KB to MB', () => {
		expect(convertBytes(Math.pow(2, 10), 'KB', 'MB')).to.equal(1);
	});

	it('correctly converts GB to MB', () => {
		expect(convertBytes(1, 'GB', 'MB')).to.equal(Math.pow(2, 10));
	});

	it('returns correctly with a negative byte count', () => {
		expect(convertBytes(-Math.pow(2, 10), 'B', 'KB')).to.equal(-1);
	});

	it('returns correctly with a byte count set to 0', () => {
		expect(convertBytes(0, 'B', 'MB')).to.equal(0);
	});

	it('returns correctly with a byte count set to the maximum safe integer', () => {
		expect(convertBytes(Number.MAX_SAFE_INTEGER, 'B', 'GB')).to.equal(8_388_607.999_999_999);
	});
});
