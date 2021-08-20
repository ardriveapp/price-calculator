import { expect } from 'chai';
import { fake, SinonStubbedInstance, stub } from 'sinon';
import { TokenFiatPair, TokenFiatRate } from './token_fiat_price';
import { CachingTokenToFiatOracle } from './caching_token_to_fiat_oracle';
import { CoinGeckoTokenToFiatOracle, Fetcher, JSFetcher } from './coingecko_token_to_fiat_oracle';

type ArweaveID = 'arweave';
type UsdID = 'usd';

const token: ArweaveID = 'arweave';
const fiat: UsdID = 'usd';
const myTestingPair = new TokenFiatPair(token, fiat);
const testingCacheLifespan = 1000 * 0; // 0 sec
const examplePriceValue = 15.05;

const coingeckoResponseSample = `{
	"${token}": {
		"${fiat}": ${examplePriceValue}
	}
}`;

const myCustomResponse: Response = {
	async json(): Promise<string> {
		return JSON.parse(coingeckoResponseSample);
	}
} as Response;

describe('The CachingTokenToFiatOracle class', () => {
	const stubbedFetcher: SinonStubbedInstance<Fetcher> = stub(new JSFetcher());
	const stubbedFetch = stubbedFetcher.fetch
		// .withArgs('https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd')
		.callsFake(async () => myCustomResponse);
	const coingeckoOracle = new CoinGeckoTokenToFiatOracle(stubbedFetcher);
	let cachingOracle: CachingTokenToFiatOracle;

	describe('Fetch calls count', () => {
		before(() => {
			cachingOracle = new CachingTokenToFiatOracle(token, [fiat], testingCacheLifespan, coingeckoOracle);
			// stubbedOracle.getFiatRatesForToken.callsFake(async () => [
			// 	new TokenFiatRate(token, fiat, examplePriceValue)
			// ]);
		});

		it('Does not fetch data when just initialized', () => {
			expect(stubbedFetch.callCount).to.equal(0);
		});

		it('Performs a fetch when getPriceForFiatTokenPair() is first called', async () => {
			await cachingOracle.getPriceForFiatTokenPair(myTestingPair);
			expect(stubbedFetch.callCount).to.equal(1);
		});

		it('Performs a second fetch when getPriceForFiatTokenPair() is called after the timeout expires', async () => {
			await cachingOracle.getPriceForFiatTokenPair(myTestingPair);
			expect(stubbedFetch.callCount).to.equal(2);
		});
	});
});
