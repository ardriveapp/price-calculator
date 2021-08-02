import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import TextBoxUnitDropdown from './TextBoxUnitsDropdown';

const StyledInput = styled.input`
	border: none;
	width: 60%;
`;

const StyledContainer = styled.div`
	display: flex;
	justify-content: space-between;
	background-color: white;
	border-style: none;
	padding: 10px;
	width: 100%;
	height: 4rem;
	//margin: 1rem;
	border-radius: 5px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

interface TextBoxProps {
	input?: number;
	units?: string[];
	onChange: (input: string) => void;
}

export default function TextBox({ input, units, onChange }: TextBoxProps): JSX.Element {
	return (
		<StyledContainer>
			<StyledInput type="text" name="textbox" onChange={(e) => onChange(e.target.value)} value={input} />
			<TextBoxUnitDropdown onChange={(val) => console.log(val)} units={['MB', 'KB']}></TextBoxUnitDropdown>
		</StyledContainer>
	);
}
