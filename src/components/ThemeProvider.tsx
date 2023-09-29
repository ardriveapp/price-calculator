import { JSX } from 'react';
import { ThemeDataType, themes, ThemeType } from 'src/themes';
import { ThemeProvider } from 'styled-components';

const TRUE_STRING = 'TRUE';

export function AppThemeProvider({
	children
}: {
	children: React.ReactNode;
}): JSX.Element {
	const themeName: ThemeType = getThemeName();
	const themeData: ThemeDataType = getThemeData(themeName);

	return <ThemeProvider theme={themeData}>{children}</ThemeProvider>;
}

function getThemeName(): ThemeType {
	const searchParams = new URLSearchParams(window.location.search);
	const themeName = searchParams.get('theme');
	return themeName === ThemeType.dark ? ThemeType.dark : ThemeType.light;
}

function getThemeData(themeName: ThemeType): ThemeDataType {
	const isEmbedded = getIsEmbedded();
	const themeData: ThemeDataType = {
		...themes,
		current: themes[themeName],
		themeName: themeName,
		isEmbedded
	};
	return themeData;
}

function getIsEmbedded(): boolean {
	const searchParams = new URLSearchParams(window.location.search);
	const isEmbedded = searchParams.get('embedded')?.toUpperCase();
	return isEmbedded === TRUE_STRING;
}
