import chai, { expect } from 'chai';
import { SinonStubbedInstance, stub } from 'sinon';
import { TokenFiatPair, TokenFiatRate } from './token_fiat_price';
import { CachingTokenToFiatOracle } from './caching_token_to_fiat_oracle';
import type { FiatID, TokenID } from './fiat_oracle_types';
import type { FiatOracle } from './fiat_oracle';
import { CoinGeckoTokenToFiatOracle } from './coingecko_token_to_fiat_oracle';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const token: TokenID = 'arweave';
const fiat: FiatID = 'usd';
const oneSecondCacheLifespan = 1000 * 1; // 1 sec
const noCachingLifespan = 0; // 0 sec
const examplePriceValue = 15.05;
const expectedTokenFiatRates = [new TokenFiatRate(token, fiat, examplePriceValue)];

describe('The CachingTokenToFiatOracle class', () => {
	let fiatOracleStub: SinonStubbedInstance<FiatOracle>;
	let cachingOracle: CachingTokenToFiatOracle;
	let noncachingOracle: CachingTokenToFiatOracle;
	let longFetchingOracleStub: SinonStubbedInstance<FiatOracle>;
	let longRequestOracle: CachingTokenToFiatOracle;

	beforeEach(() => {
		// TODO: Get ts-sinon working with snowpack so we don't have to use a concrete type here
		fiatOracleStub = stub(new CoinGeckoTokenToFiatOracle());
		fiatOracleStub.getFiatRatesForToken.callsFake(async () => expectedTokenFiatRates);
		cachingOracle = new CachingTokenToFiatOracle(token, [fiat], oneSecondCacheLifespan, fiatOracleStub);
		noncachingOracle = new CachingTokenToFiatOracle(token, [fiat], noCachingLifespan, fiatOracleStub);

		longFetchingOracleStub = stub(new CoinGeckoTokenToFiatOracle());
		longFetchingOracleStub.getFiatRatesForToken.callsFake(
			() =>
				new Promise((res) => {
					setTimeout(() => res(expectedTokenFiatRates), 50);
				})
		);
		longRequestOracle = new CachingTokenToFiatOracle(token, [fiat], oneSecondCacheLifespan, longFetchingOracleStub);
	});

	describe('getFiatRatesForToken function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await cachingOracle.getFiatRatesForToken(token, [fiat])).to.deep.equal(expectedTokenFiatRates);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});

		it('returns result from cache after a double fetch', async () => {
			expect(await cachingOracle.getFiatRatesForToken(token, [fiat])).to.deep.equal(expectedTokenFiatRates);
			expect(await cachingOracle.getFiatRatesForToken(token, [fiat])).to.deep.equal(expectedTokenFiatRates);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});

		it('fetches correct data from network when cache is expired', async () => {
			expect(await noncachingOracle.getFiatRatesForToken(token, [fiat])).to.deep.equal(expectedTokenFiatRates);
			expect(await noncachingOracle.getFiatRatesForToken(token, [fiat])).to.deep.equal(expectedTokenFiatRates);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(2);
		});

		it('does not double re-fetch while fetches are in flight', async () => {
			longRequestOracle.getFiatRatesForToken(token, [fiat]);
			longRequestOracle.getFiatRatesForToken(token, [fiat]);
			expect(longFetchingOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});

		it('throws an error when a fiat type is requested for which we do not have data', async () => {
			expect(cachingOracle.getFiatRatesForToken(token, ['gbp'])).to.be.rejected;
		});
	});

	describe('getPriceForFiatTokenPair function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await cachingOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat))).to.deep.equal(
				expectedTokenFiatRates[0]
			);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});

		it('returns result from cache after a double fetch', async () => {
			expect(await cachingOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat))).to.deep.equal(
				expectedTokenFiatRates[0]
			);
			expect(await cachingOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat))).to.deep.equal(
				expectedTokenFiatRates[0]
			);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});

		it('fetches correct data from network when cache is expired', async () => {
			expect(await noncachingOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat))).to.deep.equal(
				expectedTokenFiatRates[0]
			);
			expect(await noncachingOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat))).to.deep.equal(
				expectedTokenFiatRates[0]
			);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(2);
		});

		it('does not double re-fetch while fetches are in flight', async () => {
			longRequestOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat));
			longRequestOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat));
			expect(longFetchingOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});
	});
});
