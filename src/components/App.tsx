import * as React from 'react';
import TextBox from './TextBox';
import Expandable from './Expandable';
import styled from 'styled-components';
import FileComparison from './FileComparison';

const AppContainer = styled.section`
	align-items: center;
	justify-content: center;
	margin: 6rem auto auto auto;
	padding: 1rem;
	max-width: 1080px;
	align-items: center;
	justify-content: center;
	display: flex;
	flex-direction: column;
	@media (min-width: 500px) {
		padding-right: 2rem;
		padding-left: 2rem;
	}
	@media (min-width: 720px) {
		flex-direction: row;
		padding-right: 3rem;
		padding-left: 3rem;
	}
	@media (min-width: 1200px) {
		padding-right: 10rem;
		padding-left: 10rem;
		font-size: 24px;
	}
`;

const FormContainer = styled.section`
	width: 100%;
	margin: 0.5rem;
	@media (min-width: 720px) {
		margin-right: 5rem;
	}
	@media (min-width: 1200px) {
		margin-right: 10rem;
	}
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
	display: flex;
	justify-content: space-evenly;
	flex-direction: column;
`;

const FaqContainer = styled.section`
	width: 100%;
	margin: 0 0.5rem;
`;

export default function App(): JSX.Element {
	return (
		<AppContainer>
			<FormContainer>
				<TextBox onChange={(val) => console.log(val)}></TextBox>
				<SolidDivider></SolidDivider>
				<TextBox onChange={(val) => console.log(val)}></TextBox>
				<DashedDivider>
					<FileComparison></FileComparison>
					<FileComparison></FileComparison>
					<FileComparison></FileComparison>
				</DashedDivider>
				<TextBox onChange={(val) => console.log(val)}></TextBox>
			</FormContainer>
			<FaqContainer>
				<h1>FAQ</h1>
				<Expandable
					title={'How are fees calculated?'}
					description={
						'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'
					}
				></Expandable>
				<Expandable title={'What is AR?'} description={' '}></Expandable>
				<Expandable
					title={'Is the price of data consistent?'}
					description={
						'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'
					}
				></Expandable>
				<Expandable
					title={'How do I know how big a file is?'}
					description={
						'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'
					}
				></Expandable>
			</FaqContainer>
		</AppContainer>
	);
}
