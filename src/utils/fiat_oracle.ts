import type { FiatID, TokenID } from './fiat_oracle_types';
import type { TokenFiatPair } from './token_fiat_pair';
import type { TokenFiatRate } from './token_fiat_rate';

export interface FiatOracle {
	getPriceForFiatTokenPair(pair: TokenFiatPair): Promise<TokenFiatRate>;
	getFiatRatesForToken(token: TokenID, fiats: readonly FiatID[]): Promise<TokenFiatRate[]>;
}
