import { useEffect, useState } from 'react';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { ARDataPriceEstimator } from '../utils';

/** ARDataPriceEstimator instance, will fire off initial fetch calls when constructed */
const arDataPriceEstimator = new ARDataPriceEstimator();

/**
 * Use calculation hook listens to changes to the global unitBox state. If a unitBox
 * changes, it will re-calculate the boxes calculate the other boxes. Then, update
 * the unitBox state with one dispatch call
 *
 * The hook is intended to be used once in the Calculator component
 */
export default function useCalculation(): void {
	const [{ unitBoxes }, dispatch] = useStateValue();

	// Save previous fiat value to state for determining which byteCount to calculate from
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

		/**
		 * Change byte count before calculation
		 *
		 * If fiat value has not changed, gets price for current byteCount in state
		 * Else byteCount is the new fiat value divided by its conversion from CoinGecko
		 */
		const byteCount =
			unitBoxes.fiat.value === prevFiatVal
				? unitBoxes.bytes.value
				: Math.round(unitBoxes.fiat.value / currentFiatToArConversion);

		try {
			/** @TODO Add ArDrive Community fee to winstonPrice */
			const winstonPrice = await arDataPriceEstimator.getWinstonPriceForByteCount(byteCount);

			const newUnitBoxes: UnitBoxes = {
				bytes: { ...unitBoxes.bytes, value: byteCount },
				ar: { ...unitBoxes.ar, value: Number((winstonPrice * 0.000_000_000_001).toFixed(12)) },
				fiat: { ...unitBoxes.fiat, value: winstonPrice * currentFiatToArConversion }
			};

			setPrevFiatVal(newUnitBoxes.fiat.value);
			dispatchCalculatedUnitBoxes(newUnitBoxes);
		} catch (err) {
			console.error('Prices could not be calculated:', err);
			setSendingCalculation(false);
		}
	}

	function dispatchCalculatedUnitBoxes(newUnitBoxes: UnitBoxes) {
		if (unitBoxes === newUnitBoxes) {
			// Don't dispatch to state if all boxes remain the same after calculation
			setSendingCalculation(false);
			return;
		}

		dispatch({ type: 'setUnitBoxes', payload: newUnitBoxes });

		setTimeout(() => {
			// 0.25 second delay before dispatching another calculation to prevent UI jitter
			setSendingCalculation(false);
		}, 250);
	}

	/** Whenever unitBoxes change, starts a new calculation */
	useEffect(() => {
		calculateUnitBoxes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unitBoxes]);
}
