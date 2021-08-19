import type { FiatID, TokenID } from './fiat_oracle_types';
import type { TokenFiatPair, TokenFiatRate } from './token_fiat_price';

export interface FiatOracle<T extends TokenID, F extends FiatID> {
	getPriceForFiatTokenPair(pair: TokenFiatPair<T, F>): Promise<TokenFiatRate<T, F>>;

	reset(): void;
}
