import type { TokenFiatRate } from './token_fiat_price';

export interface FiatOracle {
	getPriceForFiatTokenPair(): Promise<TokenFiatRate<any, any>>;
}
