import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import useDebounce from '../hooks/useDebounce';
import { useState } from 'react';

interface TextBoxProps {
	field: keyof UnitBoxes;
}

export default function TextBox({ field }: TextBoxProps): JSX.Element {
	const [{ unitBoxes }, dispatch] = useStateValue();
	const globalInputValue = unitBoxes[field].value;

	const [localInputValue, setLocalInputValue] = useState(globalInputValue);
	const [isDebouncing, setIsDebouncing] = useState(false);

	if (localInputValue !== globalInputValue && !isDebouncing) {
		// Calculation has been changed in the global state, set to new local value if NOT debouncing
		setLocalInputValue(globalInputValue);
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
	useDebounce(localInputValue, isDebouncing, dispatchValueToState, 1000);

	/** Initially hides fiat and AR inputs until data arrives and first calculation has settled */
	const hideInput: React.CSSProperties = { visibility: globalInputValue !== -1 ? 'visible' : 'hidden' };

	function onTextBoxInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const userInputValue = Number(event.target.value);

		// Only trigger debounced from local value change if the
		// user defined input converts to a number
		if (!Number.isNaN(userInputValue)) {
			setIsDebouncing(true);

			// Enforce positive integer with Math.abs()
			setLocalInputValue(Math.abs(userInputValue));
		}
	}

	return (
		<TextBoxContainer>
			<TextBoxInput
				style={hideInput}
				type="number"
				name="textbox"
				value={localInputValue.toString()} // `toString` is to remove any leading 0s
				onChange={onTextBoxInputChange}
			/>
			<CurrentUnit units={unitBoxes[field].units} currentUnit={unitBoxes[field].currUnit}></CurrentUnit>
		</TextBoxContainer>
	);
}
