import * as React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import TextBoxUnitDropdown from './TextBoxUnitsDropdown';

const StyledInput = styled.input`
	border: none;
	width: 80%;
	background-color: #fafafa;
	margin: 0.5rem;
`;

const StyledContainer = styled.div`
	display: flex;
	justify-content: space-between;
	border-style: none;
	width: 100%;
	height: 75px;
	//margin: 1rem;
	border-radius: 8px;
	background-color: #fafafa;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
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
