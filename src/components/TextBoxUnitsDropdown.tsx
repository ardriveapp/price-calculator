import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

const StyledDropdown = styled.ul`
	list-style: none;
	margin: 1rem;
	align-self: center;
`;

const StyledButton = styled.button`
	padding: 1rem;
	border: none;
`;

const CurrentUnit = styled.p``;

interface TextBoxUnitDropdownProps {
	units: string[];
	onChange: (input: string) => void;
}

export default function TextBoxUnitDropdown({ units, onChange }: TextBoxUnitDropdownProps): JSX.Element {
	const [hidden, setHidden] = useState(false);
	return (
		<StyledDropdown>
			{hidden ? (
				units.map((val) => (
					<li key={val}>
						<StyledButton onClick={() => onChange(val)}>{val}</StyledButton>
					</li>
				))
			) : (
				<CurrentUnit>MB</CurrentUnit>
			)}
		</StyledDropdown>
	);
}
