import { expect } from 'chai';
import { stub } from 'sinon';
import { TokenFiatRate } from './token_fiat_price';
import { CachingTokenToFiatOracle, TokenToFiatOracle } from './token_to_fiat_oracle';

type ArweaveID = 'ARWEAVE';
type UsdID = 'USD';

const token: ArweaveID = 'ARWEAVE';
const fiat: UsdID = 'USD';
const testingCacheLifespan = 1000 * 2; // 2 sec

const examplePriceValue = 15.05;
describe('The TokenToFiatOracle class', () => {
	const stubbedOracle = stub(new TokenToFiatOracle(fiat, token));
	let oracle: CachingTokenToFiatOracle<UsdID, ArweaveID>;

	before(() => {
		oracle = new CachingTokenToFiatOracle(fiat, token, testingCacheLifespan, stubbedOracle);
		stubbedOracle.getPriceForFiatTokenPair.callsFake(
			async () => new TokenFiatRate<UsdID, ArweaveID>(fiat, token, examplePriceValue)
		);
	});

	it('Does not fetch data when just initialized', () => {
		expect(stubbedOracle.getPriceForFiatTokenPair.callCount).to.equal(0);
	});

	it('Performs a fetch when getPriceForFiatTokenPair() is first called', async () => {
		await oracle.getPriceForFiatTokenPair();
		expect(stubbedOracle.getPriceForFiatTokenPair.callCount).to.equal(1);
	});

	it('Performs a second fetch when getPriceForFiatTokenPair() is called after the timeout expires', function (done) {
		this.timeout(testingCacheLifespan + 100);
		setTimeout(() => {
			oracle.getPriceForFiatTokenPair().then(() => {
				expect(stubbedOracle.getPriceForFiatTokenPair.callCount).to.equal(2);
				done();
			});
		}, testingCacheLifespan);
	});
});
