import type { FiatID, TokenID } from './fiat_oracle_types';

/**
 * Immutable data container class representing a token-fiat pair.
 */
export class TokenFiatPair {
	/**
	 * @param {TokenID} token a valid identifier for the crypto coin
	 * @param {FiatID} fiat the fiat currency to quote the token in
	 * @returns {TokenFiatPair} an instance with the given pair
	 */
	constructor(readonly token: TokenID, readonly fiat: FiatID) {}
}

/**
 * Immutable data container class representing a market rate of certain
 * fiat-token pair that enforces valid number ranges for the rate.
 */
export class TokenFiatRate extends TokenFiatPair {
	/**
	 * @param token a valid identifier for the crypto coin
	 * @param fiat the fiat currency to quote the token in
	 * @param fiatPerTokenRate a positive integer
	 * @returns {TokenFiatRate} an instance with the given pair
	 * @throws {@link Error} if negative values are provided for the conversion rate
	 */
	constructor(readonly token: TokenID, readonly fiat: FiatID, readonly fiatPerTokenRate: number) {
		super(token, fiat);
		if (fiatPerTokenRate < 0) {
			throw new Error(`rate (${fiatPerTokenRate}) must be a non-negative number value.`);
		}
	}
}
