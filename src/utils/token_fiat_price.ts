import type { FiatID, TokenID } from './fiat_oracle_types';

/**
 * Immutable data container class representing a market price in USD for a particular AR amount
 * that enforces valid number ranges for AR and USD price values.
 */
export class TokenToFiatPrice {
	/**
	 * @returns an ARFiatPrice instance with the given AR and USD amount
	 * @throws {@link Error} if negative or non-integer values are provided for the fiat value
	 */
	constructor(readonly fiat: FiatID = 'usd', readonly token: TokenID = 'arweave', readonly amount: number) {
		if (amount < 0 || !Number.isInteger(amount)) {
			throw new Error(`amount (${amount}) should be a non-negative integer value.`);
		}
	}
}
