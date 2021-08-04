import * as React from 'react';
import { useState } from 'react';
import { DropDownList, CurrentUnit, UnitsDropDownContainer, DropDownListItem } from './TextBoxUnitsDropdown.style';

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
		<DropDownList>
			<CurrentUnit onClick={() => setHidden(!hidden)}>MB</CurrentUnit>
			{hidden ? <UnitDropDown units={units}></UnitDropDown> : <div></div>}
		</DropDownList>
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
