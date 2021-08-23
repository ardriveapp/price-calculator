import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import useDebounce from '../hooks/useDebounce';
import { useState } from 'react';

const decimalLimits = { fiat: 8, bytes: 6, ar: 12 };

interface TextBoxProps {
	field: keyof UnitBoxes;
}

export default function TextBox({ field }: TextBoxProps): JSX.Element {
	const [{ unitBoxes }, dispatch] = useStateValue();
	const globalInputValue = unitBoxes[field].value;

	const decimalLimit = decimalLimits[field];

	const [localInputValue, setLocalInputValue] = useState(globalInputValue.toString());
	const [isDebouncing, setIsDebouncing] = useState(false);

	/** Rounds and removes any unnecessary 0s from calculated value only before displaying to user */
	const roundedDisplayValue = Number(globalInputValue.toFixed(decimalLimit)).toString();

	if (localInputValue !== roundedDisplayValue && !isDebouncing) {
		// Calculation has been changed in the global state, set to new local value if NOT debouncing
		setLocalInputValue(roundedDisplayValue);
	}

	/**
	 *  Constructs new unit boxes with debounced value, dispatches to global
	 *  state, and concludes `isDebouncing` local state
	 */
	function dispatchValueToState(debouncedValue: number) {
		if (debouncedValue !== globalInputValue) {
			// Don't dispatch to state if the values remain equal
			dispatch({
				type: 'setUnitBoxes',
				payload: { ...unitBoxes, [field]: { ...unitBoxes[field], value: debouncedValue } }
			});
		}
		setIsDebouncing(false);
	}

	/**
	 * Starts a debounce when local input is changed by user input. The `debouncedValue`
	 * will be dispatched using `dispatchValueToState` when the debounce eventually settles
	 *
	 * Will skip the debounce if `!isDebouncing`. This allows the localInputValue
	 * to freely be changed by global state calculation without triggering debounces
	 */
	useDebounce(Number(localInputValue), isDebouncing, dispatchValueToState, 1000);

	/** Initially hides fiat and AR inputs until data arrives and first calculation has settled */
	const hideInput: React.CSSProperties = { visibility: globalInputValue !== -1 ? 'visible' : 'hidden' };

	function onTextBoxInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		let userInputValue = event.target.value;

		// Only trigger debounced from local value change if the
		// user defined input converts to a number
		if (!Number.isNaN(userInputValue)) {
			setIsDebouncing(true);

			if (Number(userInputValue) < 0) {
				// Enforce positive integers with Math.abs()
				userInputValue = Math.abs(Number(userInputValue)).toString();
			}

			setLocalInputValue(userInputValue);
		}
	}

	return (
		<TextBoxContainer>
			<TextBoxInput
				style={hideInput}
				type="number"
				name="textbox"
				value={localInputValue}
				onChange={onTextBoxInputChange}
			/>
			<CurrentUnit units={unitBoxes[field].units} currentUnit={unitBoxes[field].currUnit}></CurrentUnit>
		</TextBoxContainer>
	);
}
