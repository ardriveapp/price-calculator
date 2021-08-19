import { expect } from 'chai';
import { stub } from 'sinon';
import { TokenFiatPair, TokenFiatRate } from './token_fiat_price';
import { CachingTokenToFiatOracle, TokenToFiatOracle } from './token_to_fiat_oracle';

type ArweaveID = 'ARWEAVE';
type UsdID = 'USD';

const token: ArweaveID = 'ARWEAVE';
const fiat: UsdID = 'USD';
const myTestingPair = new TokenFiatPair(token, fiat);
const testingCacheLifespan = 1000 * 0; // 2 sec
const examplePriceValue = 15.05;

describe('The CachingTokenToFiatOracle class', () => {
	const stubbedOracle = stub(new TokenToFiatOracle<ArweaveID, UsdID>([token], [fiat]));
	let oracle: CachingTokenToFiatOracle<ArweaveID, UsdID>;

	before(() => {
		oracle = new CachingTokenToFiatOracle([token], [fiat], testingCacheLifespan, 0, stubbedOracle);
		stubbedOracle.getPriceForFiatTokenPair.callsFake(
			async () => new TokenFiatRate<ArweaveID, UsdID>(token, fiat, examplePriceValue)
		);
	});

	it('Does not fetch data when just initialized', () => {
		expect(stubbedOracle.getPriceForFiatTokenPair.callCount).to.equal(0);
	});

	it('Performs a fetch when getPriceForFiatTokenPair() is first called', async () => {
		await oracle.getPriceForFiatTokenPair(myTestingPair);
		expect(stubbedOracle.getPriceForFiatTokenPair.callCount).to.equal(1);
	});

	it('Performs a second fetch when getPriceForFiatTokenPair() is called after the timeout expires', async () => {
		await oracle.getPriceForFiatTokenPair(myTestingPair);
		await oracle.getPriceForFiatTokenPair(myTestingPair);
		expect(stubbedOracle.getPriceForFiatTokenPair.callCount).to.equal(2);
	});
});
