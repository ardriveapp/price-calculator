import { useEffect, useState } from 'react';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { ARDataPriceEstimator } from '../utils';
import convertBytes, { ByteTypes } from '../utils/convertBytes';

/** ARDataPriceEstimator instance, will fire off initial fetch calls when constructed */
const arDataPriceEstimator = new ARDataPriceEstimator();

const arPerWinston = 0.000_000_000_001;

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

			const arPrice = winstonPrice * arPerWinston;

			const newUnitBoxes: UnitBoxes = {
				bytes: {
					...unitBoxes.bytes,
					value: Number(convertBytes(byteCount, unitBoxes.bytes.currUnit as ByteTypes).toFixed(6))
				},
				fiat: { ...unitBoxes.fiat, value: Number((arPrice * fiatPerAR).toFixed(6)) },
				ar: { ...unitBoxes.ar, value: Number(arPrice.toFixed(12)) }
			};

			// Save previous values to determine state changes
			setPrevUnitVals({ bytes: newUnitBoxes.ar.value, fiat: newUnitBoxes.fiat.value, ar: newUnitBoxes.ar.value });

			dispatchCalculatedUnitBoxes(newUnitBoxes);
		} catch (err) {
			console.error('Prices could not be calculated:', err);
			setSendingCalculation(false);
		}
	}

	async function determineWinstonAndBytes(): Promise<[byteCount: number, winstonPrice: number]> {
		if (unitBoxes.ar.value !== prevUnitVals.ar) {
			// AR value has changed, return winston price from byteCount -> Winston conversion
			const winstonPrice = Math.round(unitBoxes.ar.value / arPerWinston);
			const byteCount = await arDataPriceEstimator.getByteCountForWinston(winstonPrice);
			return [byteCount, winstonPrice];
		}

		let byteCount: number;
		let winstonPrice: number;

		if (unitBoxes.fiat.value !== prevUnitVals.fiat) {
			// Fiat value has been changed, use new fiat value to determine Winston price
			winstonPrice = Math.round(unitBoxes.fiat.value / fiatPerAR / arPerWinston);
			byteCount = await arDataPriceEstimator.getByteCountForWinston(winstonPrice);
		} else {
			// AR/Fiat values have not been changed, use current byte value to determine byteCount
			byteCount = Math.round(convertBytes(unitBoxes.bytes.value, unitBoxes.bytes.currUnit as ByteTypes, true));
			winstonPrice = await arDataPriceEstimator.getWinstonPriceForByteCount(byteCount);
		}

		return [byteCount, winstonPrice];
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
}
