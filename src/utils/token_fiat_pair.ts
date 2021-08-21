import type { FiatID, TokenID } from './fiat_oracle_types';

/**
 * Immutable data container class representing a token-fiat pair.
 */
export interface TokenFiatPair {
	readonly token: TokenID;
	readonly fiat: FiatID;
}
