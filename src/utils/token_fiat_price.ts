import type { FiatID, TokenID } from './fiat_oracle_types';

/**
 * Immutable data container class representing a token-fiat pair.
 */
export class TokenFiatPair {
	/**
	 * @param fiat the fiat currency to quote the token in
	 * @param token a valid identifier for the crypto coin
	 * @returns {TokenFiatPair} an instance with the given pair
	 */
	constructor(readonly fiat: FiatID = 'usd', readonly token: TokenID = 'arweave') {}
}

/**
 * Immutable data container class representing a market rate of certain
 * fiat-token pair that enforces valid number ranges for the rate.
 */
export class TokenFiatRate extends TokenFiatPair {
	/**
	 * @param fiat the fiat currency to quote the token in
	 * @param token a valid identifier for the crypto coin
	 * @param rate a positive integer
	 * @returns {TokenFiatRate} an instance with the given pair
	 * @throws {@link Error} if negative values are provided for the conversion rate
	 */
	constructor(readonly fiat: FiatID, readonly token: TokenID, readonly rate: number) {
		super(fiat, token);
		if (rate < 0) {
			throw new Error(`rate (${rate}) must be a non-negative number value.`);
		}
	}
}
