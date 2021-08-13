import { useEffect, useState } from 'react';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { ARDataPriceEstimator } from '../utils';
import convertUnit, { ByteTypes } from '../utils/convert_unit';
import { arPerWinston } from '../constants';

/** ARDataPriceEstimator instance, will fire off initial fetch calls when constructed */
const arDataPriceEstimator = new ARDataPriceEstimator();

interface UnitBoxValues {
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

	// Save previous  values for determining if a value has changed
	const [prevUnitVals, setPrevUnitVals] = useState<UnitBoxValues>({
		bytes: unitBoxes.bytes.value,
		fiat: unitBoxes.fiat.value,
		ar: unitBoxes.ar.value
	});

	/** @TODO Conversion will come from fiatToArData[unitBoxes.fiat.currUnit] in PE-68 */
	const fiatPerAR = 15.0;

	/** Whenever unitBoxes change, starts a new calculation */
	useEffect(() => {
		calculateUnitBoxes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unitBoxes]);

	/**
	 * Calculates new unit box values based on updated state
	 *
	 * @remarks Calls `determineWinstonAndBytes` to gather byteCount and winstonPrice
	 * and `dispatchCalculatedUnitBoxes` to dispatch the calculated boxes
	 */
	async function calculateUnitBoxes(): Promise<void> {
		if (sendingCalculation) {
			// Don't calculate if calculation is already dispatching, or cooling down
			return;
		}
		setSendingCalculation(true);

		try {
			// Price estimator has several error throwing cases, wrap all calls in try/catch

			/** @TODO Add ArDrive Community fee to determined winstonPrice before closing PE-67 */
			const [byteCount, winstonPrice] = await determineWinstonAndBytes();

			const newArPrice = winstonPrice * arPerWinston;

			const newByteValue = Number(convertUnit(byteCount, unitBoxes.bytes.currUnit as ByteTypes).toFixed(6));
			const newFiatValue = Number((newArPrice * fiatPerAR).toFixed(6));
			const newArValue = Number(newArPrice.toFixed(12));

			const newUnitBoxes: UnitBoxes = {
				bytes: { ...unitBoxes.bytes, value: newByteValue },
				fiat: { ...unitBoxes.fiat, value: newFiatValue },
				ar: { ...unitBoxes.ar, value: newArValue }
			};

			// Save previous values to determine state changes
			setPrevUnitVals({ bytes: newByteValue, fiat: newFiatValue, ar: newArValue });

			dispatchCalculatedUnitBoxes(newUnitBoxes);
		} catch (err) {
			console.error('Prices could not be calculated:', err);
			setSendingCalculation(false);
		}
	}

	/**
	 * Uses previous unit box values from state to determine which value has been changed, then
	 * determines byteCount and winstonPrice to return by calling the ARDataPriceEstimator
	 */
	async function determineWinstonAndBytes(): Promise<[byteCount: number, winstonPrice: number]> {
		let byteCount: number;
		let winstonPrice: number;

		if (unitBoxes.ar.value !== prevUnitVals.ar) {
			// AR value has been changed, use new ar value to determine winstonPrice
			winstonPrice = Math.round(unitBoxes.ar.value / arPerWinston);
			byteCount = await arDataPriceEstimator.getByteCountForWinston(winstonPrice);
		} else if (unitBoxes.fiat.value !== prevUnitVals.fiat) {
			// Fiat value has been changed, use new fiat value to determine winstonPrice
			winstonPrice = Math.round(unitBoxes.fiat.value / fiatPerAR / arPerWinston);
			byteCount = await arDataPriceEstimator.getByteCountForWinston(winstonPrice);
		} else {
			// AR and Fiat values have not been changed, use current byte value to determine byteCount
			byteCount = Math.round(convertUnit(unitBoxes.bytes.value, unitBoxes.bytes.currUnit as ByteTypes, true));
			winstonPrice = await arDataPriceEstimator.getWinstonPriceForByteCount(byteCount);
		}

		return [byteCount, winstonPrice];
	}

	/**
	 * Dispatches new unit boxes to global state if those boxes have been changed.
	 * Also starts a short dispatch cool down to prevent ui jitter
	 */
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
}
