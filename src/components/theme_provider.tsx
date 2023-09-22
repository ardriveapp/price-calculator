import { AppTheme, themes, ThemeType, ThemesWithCurrentType as ThemeWithDefaultType } from 'src/themes';
import { ThemeProvider } from 'styled-components';

export function AppThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const themeName: ThemeType = getThemeName();
	const currentTheme: AppTheme = themes[themeName];
	const themeData: Record<ThemeWithDefaultType, AppTheme> = {
		...themes,
		current: currentTheme
	};

	console.log(`Using theme: ${themeName}`);

	return <ThemeProvider theme={themeData}>{children}</ThemeProvider>;
}

function getThemeName(): ThemeType {
	const searchParams = new URLSearchParams(window.location.search);
	const themeName = searchParams.get('theme');
	return themeName === ThemeType.dark ? ThemeType.dark : ThemeType.light;
}
