import { RatesOracle, TurboRatesOracle } from './turbo_rates_oracle';
import type { TurboRates } from './turbo_rates';
import type { FiatOracle } from './fiat_oracle';
import type { FiatID, TokenID } from './fiat_oracle_types';
import type { TokenFiatPair } from './token_fiat_pair';
import { TokenFiatRate } from './token_fiat_rate';

const pollingIntervalMilliseconds = 1000 * 60 * 15; // 15 min

export class CachingTurboRatesOracle implements FiatOracle {
	private cachedRate: TurboRates | undefined = undefined;
	private cacheTimestamp = 0;
	private syncPromise?: Promise<void>;

	constructor(
		private readonly cacheLifespan = pollingIntervalMilliseconds,
		private readonly turboRatesOracle: RatesOracle = new TurboRatesOracle()
	) {}

	getPriceForFiatTokenPair(pair: TokenFiatPair): Promise<TokenFiatRate> {
		if (pair.token !== 'credits') {
			throw new Error('Only credits are supported');
		}

		return this.getTurboRates().then((turboRates) => {
			const winstonForOneGiB = turboRates.winc;
			const arForOneGiB = winstonForOneGiB / 1e12;
			const fiatPerOneGiB = turboRates.fiat[pair.fiat];
			const fiatPerOneAR = fiatPerOneGiB / arForOneGiB;

			return new TokenFiatRate(pair.token, pair.fiat, fiatPerOneAR);
		});
	}

	getSupportedCurrencyIDs(): FiatID[] {
		if (!this.cachedRate) {
			throw new Error("Can't get supported currency IDs without cached rate");
		}

		return Object.keys(this.cachedRate.fiat) as FiatID[];
	}

	// Function to get the byte count for a given winc value
	public getByteCountForWinc(wincValue: number): number {
		// Calculate the byte count using the known conversion factor (1 GiB in bytes)
		const byteCountPerGiB = this.cachedRate!.winc;

		return (wincValue / byteCountPerGiB) * 1_073_741_824;
	}

	// Function to get the winc value for a given byte count
	public getWincForByteCount(byteCount: number): number {
		// Calculate the winc value using the known conversion factor (1 GiB in bytes)
		const byteCountMult = byteCount / 1_073_741_824;

		// return pct of winc on that
		const wincValue = +this.cachedRate!.winc * byteCountMult;
		return wincValue / 1_000_000_000_000;
	}

	async getFiatRatesForToken(token: TokenID, fiats: FiatID[]): Promise<TokenFiatRate[]> {
		await this.checkCache();

		if (token !== 'credits') {
			throw new Error('Only credits are supported');
		}
		if (!this.cachedRate) {
			throw new Error('No cached rate');
		}
		const tokenFiatRates: TokenFiatRate[] = [];
		for (const fiat of fiats) {
			const winstonForOneGiB = this.cachedRate.winc;
			const arForOneGiB = winstonForOneGiB / 1e12;
			const fiatPerOneGiB = this.cachedRate.fiat[fiat];
			const fiatPerOneAR = fiatPerOneGiB / arForOneGiB;

			tokenFiatRates.push(new TokenFiatRate(token, fiat, fiatPerOneAR));
		}

		return tokenFiatRates;
	}

	public getQueryRequestUrl(): string {
		throw new Error('Method not implemented.');
	}

	public get currentlyFetchingPrice(): boolean {
		return !!this.syncPromise;
	}

	private get shouldRefreshCacheData(): boolean {
		const currentTimestamp = Date.now();
		const deltaTimestamp = currentTimestamp - this.cacheTimestamp;
		return this.cacheTimestamp === 0 || deltaTimestamp >= this.cacheLifespan;
	}

	public async getTurboRates(): Promise<TurboRates> {
		await this.checkCache();
		return this.cachedRate as TurboRates;
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
		this.cachedRate = await this.turboRatesOracle.getTurboRates();
		this.cacheTimestamp = Date.now();
	}
}
