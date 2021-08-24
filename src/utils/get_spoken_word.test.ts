import { expect } from 'chai';
import { getSpokenWord } from './get_spoken_word';

describe('getSpokenWord function', () => {
	it('correctly converts KB into kilobyte', () => {
		expect(getSpokenWord('KB')).to.equal('kilobyte');
	});

	it('correctly converts MB into megabyte', () => {
		expect(getSpokenWord('MB')).to.equal('megabyte');
	});

	it('correctly converts GB into gigabyte', () => {
		expect(getSpokenWord('GB')).to.equal('gigabyte');
	});

	it('correctly converts AR into arweave token', () => {
		expect(getSpokenWord('AR')).to.equal('arweave token');
	});

	it('correctly returns abbreviation if it does not exist on abbreviation record', () => {
		expect(getSpokenWord('ROFL')).to.equal('ROFL');
	});
});
