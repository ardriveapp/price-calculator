import type { FiatOracle } from './fiat_oracle';
import type { TokenFiatPair } from './token_fiat_pair';
import type { FiatID, TokenID } from './fiat_oracle_types';
import { CoinGeckoTokenToFiatOracle } from './coingecko_token_to_fiat_oracle';
import type { TokenFiatRate } from './token_fiat_rate';

const pollingIntervalMilliseconds = 1000 * 60 * 15; // 15 min

export class CachingTokenToFiatOracle implements FiatOracle {
	private cachedRates: TokenFiatRate[] = [];
	private cacheTimestamp = 0;
	private syncPromise?: Promise<void>;

	/**
	 * @param {FiatID[]} fiats The currency IDs to quote tokens in
	 * @param {TokenID[]} token The token ID of the requested coin
	 * @param {number} cacheLifespan Milliseconds that has to pass until the cache is invalid
	 * @param {CoinGeckoTokenToFiatOracle} fiatOracle
	 * @return {CachingTokenToFiatOracle} A class representing the oracle for the selected currencies
	 */
	constructor(
		private readonly token: TokenID,
		private readonly fiats: FiatID[],
		private readonly cacheLifespan = pollingIntervalMilliseconds,
		private readonly fiatOracle: FiatOracle = new CoinGeckoTokenToFiatOracle()
	) {}

	private get currentlyFetchingPrice(): boolean {
		return !!this.syncPromise;
	}

	private get shouldRefreshCacheData(): boolean {
		const currentTimestamp = Date.now();
		const deltaTimestamp = currentTimestamp - this.cacheTimestamp;
		return this.cacheTimestamp === 0 || deltaTimestamp >= this.cacheLifespan;
	}

	public async getFiatRatesForToken(token: TokenID, fiats: FiatID[]): Promise<TokenFiatRate[]> {
		await this.checkCache();
		const tokenFiatRates = this.cachedRates.filter(
			(tokenFiatRate) => fiats.includes(tokenFiatRate.fiat) && token === tokenFiatRate.token
		);
		if (tokenFiatRates.length !== fiats.length) {
			throw new Error(`Missing some fiat data`);
		}
		return tokenFiatRates;
	}

	/**
	 * @param {TokenFiatPair} pair The specific pair you want to query
	 * @returns {Promise<TokenToFiatPrice>} The cached price value
	 */
	public async getPriceForFiatTokenPair(pair: TokenFiatPair): Promise<TokenFiatRate> {
		return (await this.getFiatRatesForToken(pair.token, [pair.fiat]))[0];
	}

	private async checkCache(): Promise<void> {
		if (this.currentlyFetchingPrice) {
			return this.syncPromise;
		}
		if (this.shouldRefreshCacheData) {
			this.syncPromise = this.refreshPrices();
			await this.syncPromise;
			delete this.syncPromise;
		}
	}

	private async refreshPrices(): Promise<void> {
		this.cachedRates = await this.fiatOracle.getFiatRatesForToken(this.token, this.fiats);
		this.cacheTimestamp = Date.now();
	}
}
