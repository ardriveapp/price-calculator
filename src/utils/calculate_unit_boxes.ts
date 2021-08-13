import type { UnitBoxValues } from '../hooks/useCalculation';
import type { ByteUnitType, UnitBoxes } from '../types';
import { ARDataPriceEstimator } from './ar_data_price_estimator';
import convertUnit from './convert_unit';
import type { PriceEstimator } from './price_estimator';

/**
 * A utility class responsible for calculating the new unit boxes to
 * display to the user based on the changes to the global state
 *
 * @remarks Will construct a new ARDataPriceEstimator upon initial
 * creation, which fires off 3 network calls for AR<>Data models
 */
export class UnitBoxCalculator {
	constructor(private readonly arDataPriceEstimator: PriceEstimator = new ARDataPriceEstimator()) {}

	/**
	 * Calculates new unit box values dependent on the specified parameters
	 *
	 * @param value current value that has been set by the user
	 * @param unit type of unit box that has been changed: 'bytes' | 'fiat' | 'ar'
	 * @param fiatPerAR current fiat -> ar conversion rate from global state
	 * @param byteUnit current byte unit type from global state
	 *
	 * @returns newly calculated unit box values
	 *
	 * @remarks ArDrive Community Fee is not yet considered in the calculations
	 */
	async calculateUnitBoxValues(
		value: number,
		unit: keyof UnitBoxes,
		fiatPerAR: number,
		byteUnit: ByteUnitType
	): Promise<UnitBoxValues> {
		let newARValue: number;

		switch (unit) {
			case 'bytes':
				newARValue = await this.arDataPriceEstimator.getARPriceForByteCount(
					Math.round(convertUnit(value, byteUnit, 'B'))
				);
				break;

			case 'fiat':
				newARValue = value / fiatPerAR;
				break;

			case 'ar':
				newARValue = value;
				break;
		}

		const byteCount = await this.arDataPriceEstimator.getByteCountForAR(newARValue);

		const newByteValue = Number(convertUnit(byteCount, 'B', byteUnit).toFixed(6));
		const newFiatValue = Number((newARValue * fiatPerAR).toFixed(6));
		const newArValue = Number(newARValue.toFixed(12));

		return { bytes: newByteValue, fiat: newFiatValue, ar: newArValue };
	}
}
