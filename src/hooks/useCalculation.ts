import { useEffect, useState } from 'react';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { UnitBoxCalculator } from '../utils/calculate_unit_boxes';
import convertUnit from '../utils/convert_unit';
import type { FiatID } from '../utils/fiat_oracle_types';

/** UnitBoxCalculator instance, will fire off initial fetch calls when constructed */
const unitBoxCalculator = new UnitBoxCalculator();
export interface UnitBoxValues {
	bytes: number;
	fiat: number;
	ar: number;
}

/**
 * Use calculation hook listens to changes to the global unitBox state. If a unitBox
 * changes, it will re-calculate the boxes. Then, it will update the unitBox state
 * with the newly calculated boxes with one dispatch call
 */
export default function useCalculation(): void {
	const [{ unitBoxes, arDriveCommunityTip, oracleErrors: oracleErrorsFromState }, dispatch] = useStateValue();
	const [sendingCalculation, setSendingCalculation] = useState(false);

	// Save previous unit box values for determining if a value has changed
	const [prevUnitValues, setPrevUnitValues] = useState<UnitBoxValues>({
		bytes: unitBoxes.bytes.value,
		fiat: unitBoxes.fiat.value,
		ar: unitBoxes.ar.value
	});

	// Save previous byte unit for determining byte unit changes
	const [byteCurrUnit, setByteCurrUnit] = useState(unitBoxes.bytes.currUnit);
	const [fiatCurrUnit, setFiatCurrUnit] = useState(unitBoxes.fiat.currUnit);

	/**
	 * Whenever unitBoxes change, this useEffect hook will start a new calculation
	 *
	 * It will also fire off new calculations when the fiat oracle returns with fresh data
	 */
	useEffect(() => {
		dispatchNewUnitBoxes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unitBoxes, unitBoxCalculator.fiatOracle.currentlyFetchingPrice]);

	/**
	 * Calculates new unit box values based on updated state. Then, dispatches
	 * the new unit boxes back to the global state to be displayed to the user
	 */
	async function dispatchNewUnitBoxes(): Promise<void> {
		if (sendingCalculation) {
			// Don't calculate if calculation is already dispatching, or cooling down
			return;
		}
		setSendingCalculation(true);

		let newUnitBoxValues: UnitBoxValues;

		if (unitBoxes.bytes.currUnit !== byteCurrUnit) {
			// When byte unit has been changed by the user, only update the bytes value directly
			const newBytesValue = convertUnit(unitBoxes.bytes.value, byteCurrUnit, unitBoxes.bytes.currUnit);

			newUnitBoxValues = {
				...prevUnitValues,
				bytes: newBytesValue
			};

			setByteCurrUnit(unitBoxes.bytes.currUnit);
		} else if (unitBoxes.fiat.currUnit !== fiatCurrUnit) {
			// When fiat unit has been changed by the user, only update the fiat value directly
			let newFiatPerAR: number;

			try {
				newFiatPerAR = (
					await unitBoxCalculator.fiatOracle.getPriceForFiatTokenPair({
						fiat: unitBoxes.fiat.currUnit.toLowerCase() as FiatID,
						token: 'arweave'
					})
				).fiatPerTokenRate;
			} catch (err) {
				console.error('Fiat rate could not be determined:', err);
				dispatch({ type: 'setFiatToARError' });
				setSendingCalculation(false);
				// Fiat oracle has thrown an error, return early
				return;
			}

			const newFiatValue = unitBoxes.ar.value * newFiatPerAR;

			newUnitBoxValues = {
				...prevUnitValues,
				fiat: newFiatValue
			};

			setFiatCurrUnit(unitBoxes.fiat.currUnit);
		} else {
			let valueToCalculate: number;
			let unitBoxType: keyof UnitBoxes;

			if (unitBoxes.ar.value !== prevUnitValues.ar) {
				// Bytes current unit or AR value has been changed, use ar value to determine new values
				valueToCalculate = unitBoxes.ar.value;
				unitBoxType = 'ar';
			} else if (unitBoxes.fiat.value !== prevUnitValues.fiat) {
				// Fiat value has been changed, use new fiat value to determine new values
				valueToCalculate = unitBoxes.fiat.value;
				unitBoxType = 'fiat';
			} else {
				// AR and Fiat values have not been changed, use current byte value to determine new values
				valueToCalculate = unitBoxes.bytes.value;
				unitBoxType = 'bytes';
			}

			try {
				const { unitBoxValues, oracleErrors } = await unitBoxCalculator.calculateUnitBoxValues(
					valueToCalculate,
					unitBoxType,
					unitBoxes.fiat.currUnit.toLowerCase() as FiatID,
					unitBoxes.bytes.currUnit,
					arDriveCommunityTip
				);

				newUnitBoxValues = unitBoxValues;

				if (oracleErrors.dataToAR !== oracleErrorsFromState.dataToAR) {
					// Mismatch between dataToAR errors on global state and calc response
					if (oracleErrors.dataToAR) {
						dispatch({ type: 'setDataToARError' });
					} else {
						dispatch({ type: 'clearDataToARError' });
					}
				}

				if (oracleErrors.fiatToAR !== oracleErrorsFromState.fiatToAR) {
					// Mismatch between fiatToAR errors on global state and calc response
					if (oracleErrors.fiatToAR) {
						dispatch({ type: 'setFiatToARError' });
					} else {
						dispatch({ type: 'clearFiatToARError' });
					}
				}
			} catch (err) {
				console.error('Prices could not be calculated:', err);
				setSendingCalculation(false);
				// UnitBoxCalculator has thrown an error, return early
				return;
			}
		}

		// Construct new unit boxes with their previous state and the calculated values
		const newUnitBoxes = {
			bytes: { ...unitBoxes.bytes, value: newUnitBoxValues.bytes },
			fiat: { ...unitBoxes.fiat, value: newUnitBoxValues.fiat },
			ar: { ...unitBoxes.ar, value: newUnitBoxValues.ar }
		};

		if (unitBoxes === newUnitBoxes) {
			// Don't dispatch to state if all boxes remain the same after calculation
			setSendingCalculation(false);
			return;
		}

		// Send new unit boxes to global state
		dispatch({ type: 'setUnitBoxes', payload: newUnitBoxes });

		// Save previous values to determine state changes
		setPrevUnitValues(newUnitBoxValues);

		setTimeout(() => {
			// 0.1 second delay before dispatching another calculation to prevent UI jitter
			setSendingCalculation(false);
		}, 100);
	}
}
