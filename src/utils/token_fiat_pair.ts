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
