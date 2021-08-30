import * as React from 'react';
import useCommunityTip from '../hooks/useCommunityTip';
import { AppContainer, AppContent } from './App.style';
import { AppHeader } from './AppHeader';
import Calculator from './Calculator';
import Faq from './Faq';
import { VersionNumber } from './App.style';

export default function App(): JSX.Element {
	useCommunityTip();
	return (
		<AppContainer>
			<AppHeader />
			<AppContent>
				<Calculator></Calculator>
				<Faq></Faq>
			</AppContent>
			<VersionNumber>v{import.meta.env.SNOWPACK_PUBLIC_VERSION}</VersionNumber>
		</AppContainer>
	);
}
