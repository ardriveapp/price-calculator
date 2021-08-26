import React from 'react';
import { StyledAnchor } from './AppHeader.style';
import { ArDriveLogoLight } from './icons/ArDriveLogoLight';

export function AppHeader(): JSX.Element {
	return (
		<StyledAnchor href="https://ardrive.io" aria-label="Home page">
			<ArDriveLogoLight />
		</StyledAnchor>
	);
}
