import React, { useState, useRef } from 'react';
import { ExpandableTrailingIcon } from './Expandable.style';

import {
	UnitsDropDownContainer,
	DropDownListItem,
	CurrentUnitButtonContainer,
	CurrentUnitDivContainer
} from './CurrentUnit.style';
import useOnOutsideClick from '../hooks/useOnOutsideClick';
import UpArrowIcon from './icons/UpArrowIcon';

interface CurrentUnitProps {
	units?: string[];
	currentUnit?: string;
	onChange: (input: string) => void;
}

export default function CurrentUnit({ units, currentUnit }: CurrentUnitProps): JSX.Element {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const dropDownRef = useRef(null);
	useOnOutsideClick(dropDownRef, () => setDropdownOpen(false));

	if (units && units?.length > 1) {
		return (
			<CurrentUnitButtonContainer
				onClick={() => setDropdownOpen(!dropdownOpen)}
				ref={dropdownOpen ? dropDownRef : null}
				aria-label={`${dropdownOpen ? 'Close' : 'Open'} unit selector dropdown`}
			>
				<span>{currentUnit}</span>
				<ExpandableTrailingIcon expanded={dropdownOpen}>
					<UpArrowIcon />
				</ExpandableTrailingIcon>
				{dropdownOpen && <UnitDropDown units={units} />}
			</CurrentUnitButtonContainer>
		);
	}

	return (
		<CurrentUnitDivContainer>
			<span>{currentUnit}</span>
		</CurrentUnitDivContainer>
	);
}

interface UnitDropDownProps {
	units: string[];
}

/** @TODO Pass down and use `setCurrentUnit` prop */
function UnitDropDown({ units }: UnitDropDownProps): JSX.Element {
	return (
		<UnitsDropDownContainer>
			{units.map((val) => (
				<li key={val}>
					<DropDownListItem aria-label="Set current unit" onClick={() => console.log(val)}>
						{val}
					</DropDownListItem>
				</li>
			))}
		</UnitsDropDownContainer>
	);
}
