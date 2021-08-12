import * as React from 'react';
import useCommunityTip from '../hooks/useCommunityTip';
import { AppContainer } from './App.style';
import Calculator from './Calculator';
import Faq from './Faq';

export default function App(): JSX.Element {
	useCommunityTip();
	return (
		<AppContainer>
			<Calculator></Calculator>
			<Faq></Faq>
		</AppContainer>
	);
}
