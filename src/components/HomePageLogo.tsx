import React from 'react';
import { ThemeDataType, ThemeType } from 'src/themes';
import { useTheme } from 'styled-components';
import { LogoContainer } from './HomePageLogo.style';
import { ArDriveLogoLight } from './icons/ArDriveLogoLight';
import { ArDriveLogoDark } from './icons/ArDriveLogoDark';

export function HomePageLogo(): JSX.Element {
	const themeData = useTheme() as unknown as ThemeDataType;
	const { isEmbedded } = themeData;
	const { themeName: current } = themeData;
	const style: React.CSSProperties = {
		display: isEmbedded ? 'none' : 'block'
	};
	const logo =
		current === ThemeType.light ? (
			<ArDriveLogoLight />
		) : (
			<ArDriveLogoDark />
		);

	return (
		<LogoContainer style={style}>
			<a href="https://ardrive.io" aria-label="ArDrive Home page">
				{logo}
			</a>
		</LogoContainer>
	);
}
