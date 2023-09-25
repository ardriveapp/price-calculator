import React, { JSX } from 'react';
import { StyledHeader } from './AppHeader.style';
import { HomePageLogo } from './HomePageLogo';

export function AppHeader(): JSX.Element {
	return (
		<StyledHeader>
			<HomePageLogo />
		</StyledHeader>
	);
}
