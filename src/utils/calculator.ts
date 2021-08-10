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

		// Fetch the price for a handful of reference data volumes and feed them into a linear regression
		this.setupPromise = Promise.all(
			// TODO: What to do if one fails?
			Calculator.sampleByteVolumes.map(
				async (sampleByteCount) =>
					new ARDataPrice(sampleByteCount, await this.oracle.getWinstonPriceForByteCount(sampleByteCount))
			)
		).then((pricingData) => new ARDataPriceRegression(pricingData));

		this.predictor = await this.setupPromise;
		return this.predictor;
	}

	public async getWinstonPriceForByteCount(byteCount: number): Promise<number | undefined> {
		// Lazily generate the price predictor
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
