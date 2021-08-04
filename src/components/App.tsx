import * as React from 'react';
import { AppContainer, GlobalStyle } from './App.style';
import Calculator from './Calculator';
import Faq from './Faq';

export default function App(): JSX.Element {
	return (
		<AppContainer>
			<GlobalStyle />
			<Calculator></Calculator>
			<Faq></Faq>
		</AppContainer>
	);
}
