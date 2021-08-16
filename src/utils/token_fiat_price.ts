import type { FiatID, TokenID } from './fiat_oracle_types';

/**
 * Immutable data container class representing a market rate of certain
 * fiat-token pair that enforces valid number ranges for AR and USD price values.
 */
export class TokenFiatPair {
	/**
	 * @param fiat the fiat currency to quote the token in
	 * @param token a valid identifier for the crypto coin
	 * @param rate a positive integer
	 * @returns {TokenFiatPair} an instance with the given pair
	 * @throws {@link Error} if negative or non-integer values are provided for the fiat value
	 */
	constructor(readonly fiat: FiatID = 'usd', readonly token: TokenID = 'arweave', readonly rate: number) {
		if (rate < 0 || !Number.isInteger(rate)) {
			throw new Error(`rate (${rate}) should be a non-negative integer value.`);
		}
	}
}
