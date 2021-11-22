import type { UnitBoxValues } from '../hooks/useCalculation';
import { ByteUnitType, doNotRenderValue, OracleErrors, UnitBoxes } from '../types';
import convertUnit from './convert_unit';
import { CachingTokenToFiatOracle } from './caching_token_to_fiat_oracle';
import { currencyIDs, FiatID } from './fiat_oracle_types';
import {
	AbstractARDataPriceAndCapacityEstimator,
	ARDataPriceChunkEstimator,
	ArDriveCommunityTip,
	ByteCount,
	AR
} from 'ardrive-core-js';

/**
 * A utility class responsible for calculating the new unit boxes to
 * display to the user based on the changes to the global state
 */
export class UnitBoxCalculator {
	constructor(
		private readonly arDataPriceEstimator: AbstractARDataPriceAndCapacityEstimator = new ARDataPriceChunkEstimator(
			true
		),
		private readonly fiatCachingOracle: CachingTokenToFiatOracle = new CachingTokenToFiatOracle(
			'arweave',
			currencyIDs
		)
	) {}

	/** Expose fiat oracle to determine when prices get fetched */
	public get fiatOracle(): CachingTokenToFiatOracle {
		return this.fiatCachingOracle;
	}

	/**
	 * Calculates new unit box values dependent on the specified parameters
	 *
	 * @param value current value that has been set by the user
	 * @param unit type of unit box that has been changed: 'bytes' | 'fiat' | 'ar'
	 * @param fiatUnit current fiat unit type from global state
	 * @param byteUnit current byte unit type from global state
	 * @param arDriveCommunityTip current ArDrive community fee from global state
	 *
	 * @remarks Will fire off three fetch calls for AR<>Data and one
	 *          fetch call for Fiat<>AR on the first call of this function
	 *
	 * @returns newly calculated unit box values and any oracleErrors that occur
	 */
	async calculateUnitBoxValues(
		value: number,
		unit: keyof UnitBoxes,
		fiatUnit: FiatID,
		byteUnit: ByteUnitType,
		arDriveCommunityTip: ArDriveCommunityTip
	): Promise<{ unitBoxValues: UnitBoxValues; oracleErrors: OracleErrors }> {
		let newARValue: number;
		let userDefinedByteValue: number | undefined = undefined;
		let oracleErrors: OracleErrors = { fiatToAR: false, dataToAR: false };

		let fiatPerAR: number | undefined = undefined;

		try {
			fiatPerAR = (await this.fiatCachingOracle.getPriceForFiatTokenPair({ token: 'arweave', fiat: fiatUnit }))
				.fiatPerTokenRate;
		} catch {
			oracleErrors = { ...oracleErrors, fiatToAR: true };
		}

		switch (unit) {
			case 'bytes':
				if (value === 0) {
					// If user defines 0 bytes, the new AR value becomes 0
					// rather than displaying the minimum fee
					newARValue = 0;
				} else {
					try {
						newARValue = +(await this.arDataPriceEstimator.getARPriceForByteCount(
							new ByteCount(Math.round(convertUnit(value, byteUnit, 'B'))),
							arDriveCommunityTip
						));
					} catch {
						newARValue = 1;
						oracleErrors = { ...oracleErrors, dataToAR: true };
					}
				}

				userDefinedByteValue = value;
				break;

			case 'fiat':
				newARValue = fiatPerAR ? value / fiatPerAR : value;
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
			try {
				const rawByteCount = await this.arDataPriceEstimator.getByteCountForAR(
					// Use 12 decimal places to avoid AR constructor error
					AR.from(newARValue.toFixed(12)),
					arDriveCommunityTip
				);
				byteCount = convertUnit(Math.round(+rawByteCount), 'B', byteUnit);
			} catch {
				oracleErrors = { ...oracleErrors, dataToAR: true };
				byteCount = doNotRenderValue;
			}
		}

		const newFiatValue = !oracleErrors.fiatToAR && fiatPerAR ? newARValue * fiatPerAR : doNotRenderValue;
		const newByteValue = !oracleErrors.dataToAR ? byteCount : doNotRenderValue;
		const newArValue = newARValue;

		return { unitBoxValues: { bytes: newByteValue, fiat: newFiatValue, ar: newArValue }, oracleErrors };
	}
}
