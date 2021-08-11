import { useEffect, useState } from 'react';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { ARDataPriceEstimator } from '../utils';

/** ARDataPriceEstimator instance, will fire off initial fetch calls when constructed */
const arDataPriceEstimator = new ARDataPriceEstimator();

const winstonToArValue = 0.000_000_000_001;

interface previousValues {
	bytes: number;
	fiat: number;
	ar: number;
}

/**
 * Use calculation hook listens to changes to the global unitBox state. If a unitBox
 * changes, it will re-calculate the boxes calculate the other boxes. Then, update
 * the unitBox state with one dispatch call
 *
 * The hook is intended to be used once in the Calculator component
 */
export default function useCalculation(): void {
	const [{ unitBoxes }, dispatch] = useStateValue();
	const [sendingCalculation, setSendingCalculation] = useState(false);

	// Save previous  values for determining if a value has changed
	const [prevUnitVals, setPrevUnitVals] = useState<previousValues>({
		bytes: unitBoxes.ar.value,
		fiat: unitBoxes.fiat.value,
		ar: unitBoxes.ar.value
	});

	/** @TODO Conversion will come from fiatToArData[unitBoxes.fiat.currUnit] */
	const currentFiatToWinstonConversion = 0.000_000_000_15;

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

			/** @TODO Add ArDrive Community fee to determined winstonPrice */
			const [byteCount, winstonPrice] = await determineWinstonAndBytes();

			const newUnitBoxes: UnitBoxes = {
				bytes: { ...unitBoxes.bytes, value: byteCount },
				ar: { ...unitBoxes.ar, value: Number((winstonPrice * 0.000_000_000_001).toFixed(12)) },
				fiat: { ...unitBoxes.fiat, value: Number((winstonPrice * currentFiatToWinstonConversion).toFixed(6)) }
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
			const winstonPrice = Math.round(unitBoxes.ar.value / winstonToArValue);
			const byteCount = await arDataPriceEstimator.getByteCountForWinston(winstonPrice);
			return [byteCount, winstonPrice];
		}

		let byteCount: number;
		let winstonPrice: number;

		if (unitBoxes.fiat.value !== prevUnitVals.fiat) {
			// Fiat value has changed, use Fiat<>AR conversion from coinGecko to determine Winston
			winstonPrice = Math.round(unitBoxes.fiat.value / currentFiatToWinstonConversion);
			byteCount = await arDataPriceEstimator.getByteCountForWinston(winstonPrice);
		} else if (unitBoxes.bytes.value !== prevUnitVals.bytes) {
			// ByteCount has not been changed, use stored byteCount and winston values
			byteCount = unitBoxes.bytes.value;
			winstonPrice = await arDataPriceEstimator.getWinstonPriceForByteCount(byteCount);
		} else {
			// ByteCount has been changed, gather new Winston price estimation
			byteCount = unitBoxes.bytes.value;
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
