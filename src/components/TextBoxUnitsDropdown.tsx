import * as React from 'react';
import { useState } from 'react';
import { ExpandableTrailingIcon } from './Expandable.style';
import DownArrowIcon from './icons/DownArrowIcon';
import { CurrentUnit, UnitsDropDownContainer, DropDownListItem } from './TextBoxUnitsDropdown.style';

interface TextBoxUnitDropdownProps {
	units: string[];
	onChange: (input: string) => void;
}

interface UnitDropDown {
	units: string[];
}

export default function TextBoxUnitDropdown({ units }: TextBoxUnitDropdownProps): JSX.Element {
	const [hidden, setHidden] = useState(false);
	return (
		<CurrentUnit onClick={() => setHidden(!hidden)}>
			<span>MB</span>
			<ExpandableTrailingIcon>
				<DownArrowIcon />
			</ExpandableTrailingIcon>
			{hidden && <UnitDropDown units={units}></UnitDropDown>}
		</CurrentUnit>
	);
}

function UnitDropDown({ units }: UnitDropDown): JSX.Element {
	return (
		<UnitsDropDownContainer>
			{units.map((val) => (
				<li key={val}>
					<DropDownListItem onClick={() => console.log(val)}>{val}</DropDownListItem>
				</li>
			))}
		</UnitsDropDownContainer>
	);
}
