import { expect } from 'chai';
import isValidNumericUserInputString from './valid_input_reg_exp';
import { beforeEach, describe, it } from 'vitest';

const invalidValues = [
	'pants',
	't9.02',
	'0.2.5',
	'888.88e80',
	'..90',
	'99..',
	'ultimate.number',
	'0.00842.2654.433',
	'R2.D2'
];

const validValues = [
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

describe('isValidNumericUserInputString function', () => {
	it('returns false when used with invalid values', () => {
		for (const value of invalidValues) {
			expect(isValidNumericUserInputString(value)).to.be.false;
		}
	});

	it('returns true when used with valid values', () => {
		for (const value of validValues) {
			expect(isValidNumericUserInputString(value)).to.be.true;
		}
	});
});
