import React from 'react';
import { LogoContainer } from './HomePageLogo.style';
import { ArDriveLogoLight } from './icons/ArDriveLogoLight';

export function HomePageLogo(): JSX.Element {
	return (
		<LogoContainer>
			<a href="https://ardrive.io" aria-label="Home page">
				<ArDriveLogoLight />
			</a>
		</LogoContainer>
	);
}
