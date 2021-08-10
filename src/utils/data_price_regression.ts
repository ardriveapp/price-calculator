import regression, { DataPoint } from 'regression';
import { ARDataPrice } from './ardataprice';

/**
 * A prediction tool for estimating the AR price (in Winston) for a data upload of a specified size based
 * on a supplied set of observations of market prices. A linear prediction model is used for estimation.
 */
export class ARDataPriceRegression {
	private readonly regression: regression.Result;

	/**
	 * Create a new price curve (linear) regression based on the supplied set of input price observations
	 * @param pricingData an array of recent data price observations
	 * @returns an ARDataPriceRegression that is ready for generating price predictions
	 * @throws {@link Error} for an empty pricing data array
	 */
	constructor(pricingData: ARDataPrice[]) {
		if (!pricingData.length) {
			throw new Error('Regession can not be run with an empty ARDataPrice list!');
		}

		const dataPoints: DataPoint[] = pricingData.map(
			(pricingDatapoint) => [pricingDatapoint.numBytes, pricingDatapoint.winstonPrice] as DataPoint
		);

		this.regression = regression.linear(dataPoints);
	}

	/**
	 * Predicts the AR (Winston) price for an upload with the specified size
	 * @param numBytes the size, in bytes, of the upload whose price we want to predict
	 * @returns the ARDataPrice predicted by the regression model for an upload of size `numBytes`
	 * @throws {@link Error} if `numBytes` is negative or not an integer
	 */
	predictedPriceForByteCount(numBytes: number): ARDataPrice {
		if (numBytes < 0 || !Number.isInteger(numBytes)) {
			throw new Error(`numBytes (${numBytes}) should be a positive integer`);
		}

		const regressionResult = this.regression.predict(numBytes);
		return new ARDataPrice(regressionResult[0], regressionResult[1]);
	}
}
