import * as React from 'react';
import { JSX } from 'react';
import { AppContainer, AppContent, VersionNumber } from './App.style';
import { AppHeader } from './AppHeader';
import Calculator from './Calculator';
import Faq from './Faq';

export default function App(): JSX.Element {
	console.log(import.meta.env);
	return (
		<AppContainer>
			<AppHeader />
			<AppContent>
				<Calculator></Calculator>
				<Faq></Faq>
			</AppContent>
			<VersionNumber>v{import.meta.env.PACKAGE_VERSION}</VersionNumber>
		</AppContainer>
	);
}
