import type { TokenToFiatPrice } from './token_fiat_price';
import type { FiatID, TokenID } from './fiat_oracle_types';

export interface FiatOracle {
	getPriceForFiatTokenPair(fiat: FiatID, token: TokenID): Promise<TokenToFiatPrice>;
}
