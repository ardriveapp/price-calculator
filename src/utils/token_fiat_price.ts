import type { FiatID, TokenID } from './fiat_oracle_types';

/**
 * Immutable data container class representing a token-fiat pair.
 */
export class TokenFiatPair<T extends TokenID, F extends FiatID> {
	/**
	 * @param {TokenID} token a valid identifier for the crypto coin
	 * @param {FiatID} fiat the fiat currency to quote the token in
	 * @returns {TokenFiatPair} an instance with the given pair
	 */
	constructor(readonly token: T, readonly fiat: F) {}
}

/**
 * Immutable data container class representing a market rate of certain
 * fiat-token pair that enforces valid number ranges for the rate.
 */
export class TokenFiatRate<T extends TokenID, F extends FiatID> extends TokenFiatPair<T, F> {
	/**
	 * @param token a valid identifier for the crypto coin
	 * @param fiat the fiat currency to quote the token in
	 * @param rate a positive integer
	 * @returns {TokenFiatRate} an instance with the given pair
	 * @throws {@link Error} if negative values are provided for the conversion rate
	 */
	constructor(readonly token: T, readonly fiat: F, readonly rate: number) {
		super(token, fiat);
		if (rate < 0) {
			throw new Error(`rate (${rate}) must be a non-negative number value.`);
		}
	}
}
