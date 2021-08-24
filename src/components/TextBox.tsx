import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import useDebounce from '../hooks/useDebounce';
import { useState } from 'react';
import isValidInput from '../utils/valid_input_reg_exp';

interface TextBoxProps {
	field: keyof UnitBoxes;
}

export default function TextBox({ field }: TextBoxProps): JSX.Element {
	const [{ unitBoxes }, dispatch] = useStateValue();
	const globalInputValue = unitBoxes[field].value;

	const [localInputValue, setLocalInputValue] = useState(globalInputValue.toString());
	const [isDebouncing, setIsDebouncing] = useState(false);

	if (Number(localInputValue) !== globalInputValue && !isDebouncing) {
		// Calculation has been changed in the global state, set to new local value if NOT debouncing
		setLocalInputValue(globalInputValue.toString());
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

		// Only trigger debounce from local value change if the
		// user defined input is a valid input
		if (isValidInput(userInputValue)) {
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
				type="text"
				pattern="^[0-9]*[.]?[0-9]*$"
				name="textbox"
				value={localInputValue}
				onChange={onTextBoxInputChange}
			/>
			<CurrentUnit units={unitBoxes[field].units} currentUnit={unitBoxes[field].currUnit}></CurrentUnit>
		</TextBoxContainer>
	);
}
