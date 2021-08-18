import type { FiatID, TokenID } from './fiat_oracle_types';

/**
 * Immutable data container class representing a token-fiat pair.
 */
export class TokenFiatPair<F extends FiatID, T extends TokenID> {
	/**
	 * @param {FiatID} fiat the fiat currency to quote the token in
	 * @param {TokenID} token a valid identifier for the crypto coin
	 * @returns {TokenFiatPair} an instance with the given pair
	 */
	constructor(readonly fiat: F, readonly token: T) {}
}

/**
 * Immutable data container class representing a market rate of certain
 * fiat-token pair that enforces valid number ranges for the rate.
 */
export class TokenFiatRate<F extends FiatID, T extends TokenID> extends TokenFiatPair<F, T> {
	/**
	 * @param fiat the fiat currency to quote the token in
	 * @param token a valid identifier for the crypto coin
	 * @param rate a positive integer
	 * @returns {TokenFiatRate} an instance with the given pair
	 * @throws {@link Error} if negative values are provided for the conversion rate
	 */
	constructor(readonly fiat: F, readonly token: T, readonly rate: number) {
		super(fiat, token);
		if (rate < 0) {
			throw new Error(`rate (${rate}) must be a non-negative number value.`);
		}
	}
}
