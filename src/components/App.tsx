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
`;

export default function App(): JSX.Element {
	return (
		<StyledApp>
			<section className="Form">
				<ul>
					<TextBox onChange={(val) => console.log(val)}></TextBox>
					<TextBox onChange={(val) => console.log(val)}></TextBox>
					<TextBox onChange={(val) => console.log(val)}></TextBox>
				</ul>
			</section>
			<section className="FAQ">
				<Expandable></Expandable>
				<Expandable></Expandable>
				<Expandable></Expandable>
			</section>
		</StyledApp>
	);
}
