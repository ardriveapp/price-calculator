import type { TokenFiatPair, TokenFiatRate } from './token_fiat_price';

export interface FiatOracle {
	getPriceForFiatTokenPair(pair: TokenFiatPair): Promise<TokenFiatRate>;
}
