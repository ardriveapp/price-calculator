import { GatewayOracle } from './gateway_oracle';
import type { ArweaveOracle } from './arweave_oracle';
import { ARDataPriceRegression } from './data_price_regression';
import { ARDataPrice } from './ar_data_price';

/**
 * A utility class for Arweave data pricing estimation.
 * Fetches Arweave data prices to build a linear regression model to use for estimations.
 */
export class ARDataPriceEstimator {
	private static readonly sampleByteVolumes = [
		(2 ^ 10) * 100, // 100 KiB
		(2 ^ 20) * 100, // 100 MiB
		(2 ^ 30) * 10 // 10 GiB
	];
	private predictor?: ARDataPriceRegression;
	private setupPromise?: Promise<ARDataPriceRegression>;

	/**
	 * Creates a new estimator. Fetches pricing data proactively unless `skipSetup` is true.
	 *
	 * @param skipSetup allows for instantiation without prefetching pricing data from the oracle
	 * @param oracle a datasource for Arweave data pricing
	 *
	 * @returns an ARDataPriceEstimator
	 */
	constructor(skipSetup = false, private readonly oracle: ArweaveOracle = new GatewayOracle()) {
		if (!skipSetup) {
			this.refreshPriceData();
		}
	}

	/**
	 * Updates the regression model with fresh data from the pricing oracle
	 *
	 * @returns Promise for an {@link ARDataPriceRegression}
	 */
	public async refreshPriceData(): Promise<ARDataPriceRegression> {
		// Don't kick off another refresh while refresh is in progress
		if (this.setupPromise) {
			return this.setupPromise;
		}

		// Fetch the price for a handful of reference data volumes and feed them into a linear regression
		this.setupPromise = Promise.all(
			// TODO: What to do if one fails?
			ARDataPriceEstimator.sampleByteVolumes.map(
				async (sampleByteCount) =>
					new ARDataPrice(sampleByteCount, await this.oracle.getWinstonPriceForByteCount(sampleByteCount))
			)
		).then((pricingData) => new ARDataPriceRegression(pricingData));

		this.predictor = await this.setupPromise;
		return this.predictor;
	}

	/**
	 * Generates a price estimate, in Winston, for an upload of size `byteCount`.
	 *
	 * @param byteCount the number of bytes for which a price estimate should be generated
	 *
	 * @returns Promise for the price of an upload of size `byteCount` in Winston
	 *
	 * @remarks Will fetch pricing data for regression modeling if a regression has not yet been run.
	 */
	public async getWinstonPriceForByteCount(byteCount: number): Promise<number> {
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
	/**
	 * Generates a byteCount estimate, in bytes, from valid Winston value
	 *
	 * @throws On invalid winston values and on any issues generating pricing models
	 *
	 * @remarks Will fetch pricing data for regression modeling if a regression has not yet been run.
	 */
	public async getByteCountForWinston(winston: number): Promise<number> {
		if (winston < 0 || !Number.isInteger(winston)) {
			throw new Error('winston value should be a non-negative integer!');
		}

		// Lazily generate the price predictor
		if (!this.predictor) {
			await this.refreshPriceData();
			if (!this.predictor) {
				throw Error('Failed to generate pricing model!');
			}
		}

		return Math.max(0, winston - this.predictor.baseWinstonPrice()) / this.predictor.marginalWinstonPrice();
	}
}
