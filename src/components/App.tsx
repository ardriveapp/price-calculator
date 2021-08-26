import * as React from 'react';
import useCommunityTip from '../hooks/useCommunityTip';
import { AppContainer, AppContent } from './App.style';
import { AppHeader } from './AppHeader';
import Calculator from './Calculator';
import Faq from './Faq';

export default function App(): JSX.Element {
	useCommunityTip();
	return (
		<AppContainer>
			<AppHeader />
			<AppContent>
				<Calculator></Calculator>
				<Faq></Faq>
			</AppContent>
		</AppContainer>
	);
}
