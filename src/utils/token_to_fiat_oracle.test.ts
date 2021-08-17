import { expect } from 'chai';
import { stub } from 'sinon';
import type { CoinGeckoPriceResponseData } from './coingecko_types';
import type { FiatID, TokenID } from './fiat_oracle_types';
import { TokenFiatPair } from './token_fiat_price';
import { TokenToFiatOracle } from './token_to_fiat_oracle';

const token: TokenID = 'ARWEAVE';
const fiat: FiatID = 'USD';
const testingPair = new TokenFiatPair(fiat, token);
const testingCacheLifespan = 1000 * 2; // 2 sec
const halfOfTheTestingLifespan = testingCacheLifespan / 2;

const examplePriceValue = 15.05;
const coinGeckoPriceResponseForPair: CoinGeckoPriceResponseData = {
	[token]: {
		[fiat]: examplePriceValue
	}
};
const mockResponse = new Response(
	new Blob([JSON.stringify(coinGeckoPriceResponseForPair)], { type: 'application/json' })
);

describe('The fiat oracle', () => {
	const stubbedFetch = stub({ fetch });
	let oracle: TokenToFiatOracle;

	before(() => {
		oracle = new TokenToFiatOracle([fiat], [token], testingCacheLifespan, stubbedFetch.fetch);
		stubbedFetch.fetch.returns(new Promise((res) => res(mockResponse)));
	});

	describe('Cache lifespan', () => {
		it('No data fetched if just initialized', () => {
			expect(stubbedFetch.fetch.callCount).to.equal(0);
		});

		it('One single fetch call when the cache is still valid', async (done) => {
			// the first milliseconds since just created
			await oracle.getPriceForFiatTokenPair(testingPair);
			await oracle.getPriceForFiatTokenPair(testingPair);
			setTimeout(async () => {
				// half time passed
				await oracle.getPriceForFiatTokenPair(testingPair);
				await oracle.getPriceForFiatTokenPair(testingPair);
				expect(stubbedFetch.fetch.callCount).to.equal(1);
				done();
			}, halfOfTheTestingLifespan);
		});

		it('There appears a second fetch call after the cache expires', async (done) => {
			// first milliseconds after half time just passed
			await oracle.getPriceForFiatTokenPair(testingPair);
			await oracle.getPriceForFiatTokenPair(testingPair);
			expect(stubbedFetch.fetch.callCount).to.equal(1);
			setTimeout(async () => {
				// first milliseconds after the cache has expired
				await oracle.getPriceForFiatTokenPair(testingPair);
				await oracle.getPriceForFiatTokenPair(testingPair);
				expect(stubbedFetch.fetch.callCount).to.equal(2);
				done();
			}, halfOfTheTestingLifespan);
		});
	});
});
