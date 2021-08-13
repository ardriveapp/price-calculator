import { useEffect, useState } from 'react';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { UnitBoxCalculator } from '../utils/calculate_unit_boxes';

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
	const [{ unitBoxes }, dispatch] = useStateValue();
	const [sendingCalculation, setSendingCalculation] = useState(false);

	// Save previous unit box values for determining if a value has changed
	const [prevUnitValues, setPrevUnitValues] = useState<UnitBoxValues>({
		bytes: unitBoxes.bytes.value,
		fiat: unitBoxes.fiat.value,
		ar: unitBoxes.ar.value
	});

	/** @TODO Conversion will come from fiatToArData[unitBoxes.fiat.currUnit] in PE-68 */
	const fiatPerAR = 15.0;

	/** Whenever unitBoxes change, this useEffect hook will start a new calculation */
	useEffect(() => {
		dispatchNewUnitBoxes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unitBoxes]);

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

		try {
			let valueToCalculate: number;
			let unitBoxType: keyof UnitBoxes;

			if (unitBoxes.ar.value !== prevUnitValues.ar) {
				// AR value has been changed, use new ar value to determine new values
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

			/** @TODO ArDrive Community fee is not yet considered here, handle in PE-128 */
			const newUnitBoxValues = await unitBoxCalculator.calculateUnitBoxValues(
				valueToCalculate,
				unitBoxType,
				fiatPerAR,
				unitBoxes.bytes.currUnit
			);

			// Construct new unit boxes with their previous state and the calculated values
			const newUnitBoxes: UnitBoxes = {
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
		} catch (err) {
			console.error('Prices could not be calculated:', err);
			setSendingCalculation(false);
		}
	}
}
