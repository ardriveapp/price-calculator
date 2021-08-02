import * as React from 'react';
import TextBox from './TextBox';
import Expandable from './Expandable';
import styled from 'styled-components';

const StyledApp = styled.section`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100%;
	margin: auto;
	padding-top: 10rem;
	@media (min-width: 750px) {
		align-items: center;
		justify-content: center;
	}
`;

const FormContainer = styled.section`
	margin: 0 10rem 0 0;
`;

const SolidDivider = styled.div`
	border-left-style: solid;
	border-left-color: black;
	border-left-width: 1px;
	height: 5rem;
	margin-left: 5rem;
`;
const DashedDivider = styled.div`
	border-left-style: dashed;
	border-left-color: black;
	border-left-width: 1px;
	height: 15rem;
	margin-left: 5rem;
`;

export default function App(): JSX.Element {
	return (
		<StyledApp>
			<FormContainer>
				<ul>
					<TextBox onChange={(val) => console.log(val)}></TextBox>
					<SolidDivider></SolidDivider>
					<TextBox onChange={(val) => console.log(val)}></TextBox>
					<DashedDivider></DashedDivider>
					<TextBox onChange={(val) => console.log(val)}></TextBox>
				</ul>
			</FormContainer>
			<section className="FAQ">
				<h1>FAQ</h1>
				<Expandable title={'How much storage do I need?'} description={' '}></Expandable>
				<Expandable title={'How are fees calculated?'} description={' '}></Expandable>
				<Expandable title={'What is AR?'} description={' '}></Expandable>
				<Expandable title={'Is the price of data consistent?'} description={' '}></Expandable>
				<Expandable title={'How do I know how big a file is?'} description={' '}></Expandable>
			</section>
		</StyledApp>
	);
}
