import { expect } from 'chai';
import isValidInput from './valid_input_reg_exp';

const unexpectedValues = [
	'pants',
	't9.02',
	'0.2.5',
	'888.88e80',
	'..90',
	'99..',
	'ultimate.number',
	'0.00842.2',
	'R2.D2'
];

const expectedValues = [
	'0',
	'',
	'0.',
	'0.0',
	'0.001',
	'8759.',
	'123456789.987654321',
	'008861',
	'55555.55555',
	Number.MAX_SAFE_INTEGER.toString()
];

describe('isValidInput function', () => {
	it('returns false with unexpected values', () => {
		for (const value of unexpectedValues) {
			expect(isValidInput(value)).to.be.false;
		}
	});

	it('returns false with expected values', () => {
		for (const value of expectedValues) {
			expect(isValidInput(value)).to.be.true;
		}
	});
});
