import * as React from 'react';
import { AppContainer } from './App.style';
import Calculator from './Calculator';
import Faq from './Faq';

export default function App(): JSX.Element {
	return (
		<AppContainer>
			<Calculator></Calculator>
			<Faq></Faq>
		</AppContainer>
	);
}
