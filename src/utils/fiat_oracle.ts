import type { FiatID, TokenID } from './fiat_oracle_types';
import type { TokenFiatPair, TokenFiatRate } from './token_fiat_price';

export interface FiatOracle {
	getPriceForFiatTokenPair(pair: TokenFiatPair): Promise<TokenFiatRate>;
	getFiatRatesForToken(token: TokenID, fiats: readonly FiatID[]): Promise<TokenFiatRate[]>;
	currentlyFetchingPrice?: boolean;
}
