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
		{ tipPercentage, minARCommunityTip }: ArDriveCommunityTip,
		byteUnit: ByteUnitType
	): Promise<UnitBoxValues> {
		let newARValue: number;
		let userDefinedByteValue: number | undefined = undefined;

		switch (unit) {
			case 'bytes':
				newARValue = await this.arDataPriceEstimator.getARPriceForByteCount(
					Math.round(convertUnit(value, byteUnit, 'B'))
				);
				userDefinedByteValue = value;
				break;

			case 'fiat':
				newARValue = value / fiatPerAR;
				break;

			case 'ar':
				newARValue = value;
				break;
		}

		const communityARFee = Math.max(newARValue * tipPercentage, minARCommunityTip);

		let byteCount: number;

		if (userDefinedByteValue) {
			// Use user defined byte value to ensure user's intended value remains unchanged
			byteCount = userDefinedByteValue;
			// Remove community fee from new AR value when user defines bytes
			// Fee will be applied to AR and Fiat fields in this case
			newARValue -= communityARFee;
		} else {
			// Remove community fee from calculated bytes value when user defines a new fiat or AR field
			// Fee will be applied to the bytes field in this case
			byteCount = convertUnit(
				Math.round(await this.arDataPriceEstimator.getByteCountForAR(newARValue - communityARFee)),
				'B',
				byteUnit
			);
		}

		const newByteValue = Number(Number(byteCount).toFixed(6));
		const newFiatValue = Number((newARValue * fiatPerAR).toFixed(6));
		const newArValue = Number(Number(newARValue).toFixed(12));

		return { bytes: newByteValue, fiat: newFiatValue, ar: newArValue };
	}
}
