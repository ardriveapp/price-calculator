import { GatewayOracle } from './gateway_oracle';
import type { ArweaveOracle } from './arweave_oracle';
import { ARDataPriceRegression } from './data_price_regression';
import { ARDataPrice } from './ardataprice';

export class Calculator {
	private static readonly sampleByteVolumes = [
		(2 ^ 10) * 100, // 100 KiB
		(2 ^ 20) * 100, // 100 MiB
		(2 ^ 30) * 10 // 10 GiB
	];
	private predictor?: ARDataPriceRegression;
	private setupPromise?: Promise<ARDataPriceRegression>;

	constructor(skipSetup = false, private readonly oracle: ArweaveOracle = new GatewayOracle()) {
		if (!skipSetup) {
			this.refreshPriceData();
		}
	}

	public async refreshPriceData(): Promise<ARDataPriceRegression> {
		// Don't kick off another refresh while refresh is in progress
		if (this.setupPromise) {
			return this.setupPromise;
		}

		this.setupPromise = this.fetchData().then((pricingData) => new ARDataPriceRegression(pricingData));
		this.predictor = await this.setupPromise;
		return this.predictor;
	}

	private async fetchData(): Promise<ARDataPrice[]> {
		const winstonSamplesQuery = Calculator.sampleByteVolumes.map(async (sampleByteCount) => {
			const price = await this.oracle.getWinstonPriceForByteCount(sampleByteCount);
			return new ARDataPrice(sampleByteCount, price);
		});

		// TODO: What to do if one fails?
		return await Promise.all(winstonSamplesQuery);
	}

	public async getWinstonPriceForByteCount(byteCount: number): Promise<number | undefined> {
		if (!this.predictor) {
			await this.refreshPriceData();
			if (!this.predictor) {
				throw Error('Failed to generate pricing model!');
			}
		}

		const predictedPrice = this.predictor.predictedPriceForByteCount(byteCount);
		return predictedPrice.winstonPrice;
	}
}
