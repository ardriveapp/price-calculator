import { useEffect, useState } from 'react';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { Calculator } from '../utils';

/** Regression calc instance, will fire off initial fetch calls when constructed */
const regressionCalculator = new Calculator(true);

/**
 * Use calculation hook listens to changes to the global unitBox state and will
 * calculate the other boxes and update the unitBox state with one dispatch call
 *
 * The hook is to be used once in the App component
 */
export default function useCalculation(): void {
	const [{ unitBoxes }, dispatch] = useStateValue();

	const [prevFiatVal, setPrevFiatVal] = useState(unitBoxes.fiat.value);
	const [sendingCalculation, setSendingCalculation] = useState(false);

	/** @TODO Conversion will come from fiatToArData[unitBoxes.fiat.currUnit] */
	const currentFiatToArConversion = 0.000_000_000_014;

	async function calculateUnitBoxes(): Promise<void> {
		if (sendingCalculation) {
			// Don't calculate if calculation is already dispatching, or cooling down
			return;
		}
		setSendingCalculation(true);

		/** Change byte count before calculation if fiat.value has been changed */
		const byteCount =
			unitBoxes.fiat.value === prevFiatVal
				? unitBoxes.bytes.value
				: Math.round(unitBoxes.fiat.value / currentFiatToArConversion);

		/** @TODO Add ArDrive Community tip to winstonPrice */
		const winstonPrice = await regressionCalculator.getWinstonPriceForByteCount(byteCount);

		if (winstonPrice) {
			const newUnitBoxes: UnitBoxes = {
				bytes: { ...unitBoxes.bytes, value: byteCount },
				ar: { ...unitBoxes.ar, value: Number((winstonPrice * 0.000_000_000_001).toFixed(12)) },
				fiat: { ...unitBoxes.fiat, value: winstonPrice * currentFiatToArConversion }
			};

			setPrevFiatVal(newUnitBoxes.fiat.value);
			dispatchCalculatedUnitBoxes(newUnitBoxes);
		} else {
			console.error('Winston price could not be determined :', winstonPrice);
			setSendingCalculation(false);
		}
	}

	function dispatchCalculatedUnitBoxes(newUnitBoxes: UnitBoxes) {
		if (unitBoxes === newUnitBoxes) {
			// Don't dispatch to state if boxes are the same
			setSendingCalculation(false);
			return;
		}

		dispatch({ type: 'setUnitBoxes', payload: newUnitBoxes });

		setTimeout(() => {
			// Short cool down before dispatching another calculation for performance concerns
			setSendingCalculation(false);
		}, 250);
	}

	/** Whenever unitBoxes change, start a new calculation */
	useEffect(() => {
		calculateUnitBoxes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unitBoxes]);
}
