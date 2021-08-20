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
const testingCacheLifespan = 1000 * 0; // 0 sec
const examplePriceValue = 15.05;
const expectedTokenFiatRates = [new TokenFiatRate(token, fiat, examplePriceValue)];

describe('The CachingTokenToFiatOracle class', () => {
	let fiatOracleStub: SinonStubbedInstance<FiatOracle>;
	let cachingOracle: CachingTokenToFiatOracle;

	beforeEach(() => {
		// TODO: Get ts-sinon working with snowpack so we don't have to use a concrete type here
		fiatOracleStub = stub(new CoinGeckoTokenToFiatOracle());
		fiatOracleStub.getFiatRatesForToken.callsFake(async (token, fiats) => {
			if (token && !fiats.length) {
				throw new Error('Fiats must be provided!');
			}
			return expectedTokenFiatRates;
		});
		cachingOracle = new CachingTokenToFiatOracle(token, [fiat], testingCacheLifespan, fiatOracleStub);
	});

	describe('getFiatRatesForToken function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await cachingOracle.getFiatRatesForToken(token, [fiat])).to.deep.equal(expectedTokenFiatRates);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});

		it('throws an error when no fiats are provided', async () => {
			cachingOracle = new CachingTokenToFiatOracle(token, [], testingCacheLifespan, fiatOracleStub);
			expect(cachingOracle.getFiatRatesForToken(token, [])).to.be.rejected;
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});
	});

	describe('getPriceForFiatTokenPair function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await cachingOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat))).to.deep.equal(
				new TokenFiatRate(token, fiat, examplePriceValue)
			);
			expect(fiatOracleStub.getFiatRatesForToken.callCount).to.equal(1);
		});
	});
});
