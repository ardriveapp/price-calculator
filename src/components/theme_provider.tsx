import { ThemeDataType, themes, ThemeType } from 'src/themes';
import { ThemeProvider } from 'styled-components';

export function AppThemeProvider({
	children
}: {
	children: React.ReactNode;
}): JSX.Element {
	const themeName: ThemeType = getThemeName();
	const themeData: ThemeDataType = getThemeData(themeName);

	console.log(`Using theme: ${themeName}`);

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
		current: themeName,
		isEmbedded
	};
	return themeData;
}

function getIsEmbedded(): boolean {
	const searchParams = new URLSearchParams(window.location.search);
	const isEmbedded = searchParams.get('embedded');
	return isEmbedded === 'true' || isEmbedded === 'YAS';
}