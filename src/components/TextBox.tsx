import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import { getSpokenWord } from '../utils/get_spoken_word';
import useDebounce from '../hooks/useDebounce';
import { useState } from 'react';
import isValidInput, { validInputRegExp } from '../utils/valid_input_reg_exp';

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
	const roundedGlobalValue = Number(globalInputValue.toFixed(decimalLimit));

	if (Number(localInputValue) !== roundedGlobalValue && !isDebouncing && localInputValue !== '.') {
		// Calculation has been changed in the global state, set to new local value
		// only if NOT debouncing and if the localInputValue is not a single decimal
		// The special case for the single dot allows the user to begin typing a decimal
		setLocalInputValue(roundedGlobalValue.toString());
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

		if (isValidInput(userInputValue)) {
			// Only set local input value if the user defined input is a valid input
			if (userInputValue === '.') {
				// When input is changed to a single decimal, cancel debounce
				setIsDebouncing(false);
			} else {
				// Otherwise, trigger new debounce
				setIsDebouncing(true);

				if (Number(userInputValue) < 0) {
					// Enforce any negative integers into positive integers with Math.abs()
					userInputValue = Math.abs(Number(userInputValue)).toString();
				}
			}
			setLocalInputValue(userInputValue);
		}
	}

	return (
		<TextBoxContainer>
			<TextBoxInput
				style={hideInput}
				type="text"
				pattern={validInputRegExp.source}
				name="textbox"
				value={localInputValue}
				onChange={onTextBoxInputChange}
				aria-label={`${getSpokenWord(unitBoxes[field].currUnit)} input field`}
			/>
			<CurrentUnit units={unitBoxes[field].units} currentUnit={unitBoxes[field].currUnit}></CurrentUnit>
		</TextBoxContainer>
	);
}
