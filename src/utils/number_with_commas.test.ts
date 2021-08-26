import { expect } from 'chai';
import numberWithCommas from './number_with_commas';

const englishUSLocale = 'en-US';

describe('The numberWithCommas function', () => {
	it('correctly places commas into long numbers', () => {
		expect(numberWithCommas(10_000_000, englishUSLocale)).to.equal('10,000,000');
	});

	it('correctly places commas into maximum safe int', () => {
		expect(numberWithCommas(Number.MAX_SAFE_INTEGER, englishUSLocale)).to.equal('9,007,199,254,740,991');
	});

	it('does not add commas into numbers with 3 or less digits', () => {
		expect(numberWithCommas(100, englishUSLocale)).to.equal('100');
	});

	it('does not add commas into 0', () => {
		expect(numberWithCommas(0, englishUSLocale)).to.equal('0');
	});

	it('works with negative integers', () => {
		expect(numberWithCommas(-10_000_000, englishUSLocale)).to.equal('-10,000,000');
	});

	it('rounds to thousandths on non-integer decimal values ', () => {
		expect(numberWithCommas(10_000_000.555_555_555, englishUSLocale)).to.equal('10,000,000.556');
	});
});
