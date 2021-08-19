import type { FiatID, TokenID } from './fiat_oracle_types';
import type { TokenFiatPair, TokenFiatRate } from './token_fiat_price';

export interface FiatOracle<T extends TokenID, F extends FiatID> {
	getPriceForFiatTokenPair<Token extends T, Fiat extends F>(
		pair: TokenFiatPair<Token, Fiat>
	): Promise<TokenFiatRate<Token, Fiat>>;

	reset(): void;
}
