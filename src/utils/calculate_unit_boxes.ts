import type { UnitBoxValues } from '../hooks/useCalculation';
import type { ArDriveCommunityTip, ByteUnitType, UnitBoxes } from '../types';
import { ARDataPriceRegressionEstimator } from './ar_data_price_regression_estimator';
import convertUnit from './convert_unit';
import type { ARDataPriceEstimator } from './ar_data_price_estimator';

/**
 * A utility class responsible for calculating the new unit boxes to
 * display to the user based on the changes to the global state
 *
 * @remarks Will construct a new ARDataPriceEstimator upon initial
 * creation, which fires off 3 network calls for AR<>Data models
 */
export class UnitBoxCalculator {
	constructor(private readonly arDataPriceEstimator: ARDataPriceEstimator = new ARDataPriceRegressionEstimator()) {}

	/**
	 * Calculates new unit box values dependent on the specified parameters
	 *
	 * @param value current value that has been set by the user
	 * @param unit type of unit box that has been changed: 'bytes' | 'fiat' | 'ar'
	 * @param fiatPerAR current fiat -> ar conversion rate from global state
	 * @param arDriveCommunityTip current ArDrive community fee from global state
	 * @param byteUnit current byte unit type from global state
	 *
	 * @returns newly calculated unit box values
	 */
	async calculateUnitBoxValues(
		value: number,
		unit: keyof UnitBoxes,
		fiatPerAR: number,
		arDriveCommunityTip: ArDriveCommunityTip,
		byteUnit: ByteUnitType
	): Promise<UnitBoxValues> {
		let newARValue: number;
		let userDefinedByteValue: number | undefined = undefined;

		switch (unit) {
			case 'bytes':
				if (value === 0) {
					// If user defines 0 bytes, the new AR value becomes 0
					// rather than displaying the minimum fee
					newARValue = 0;
				} else {
					newARValue = await this.arDataPriceEstimator.getARPriceForByteCount(
						Math.round(convertUnit(value, byteUnit, 'B')),
						arDriveCommunityTip
					);
				}

				userDefinedByteValue = value;
				break;

			case 'fiat':
				newARValue = value / fiatPerAR;
				break;

			case 'ar':
				newARValue = value;
				break;
		}

		let byteCount: number;

		if (userDefinedByteValue) {
			// Use user defined byte value to ensure user's intended value remains unchanged
			byteCount = userDefinedByteValue;
		} else {
			const rawByteCount = await this.arDataPriceEstimator.getByteCountForAR(newARValue, arDriveCommunityTip);
			byteCount = convertUnit(Math.round(rawByteCount), 'B', byteUnit);
		}

		const newByteValue = Number(Number(byteCount).toFixed(6));
		const newFiatValue = Number((newARValue * fiatPerAR).toFixed(6));
		const newArValue = Number(Number(newARValue).toFixed(12));

		return { bytes: newByteValue, fiat: newFiatValue, ar: newArValue };
	}
}
