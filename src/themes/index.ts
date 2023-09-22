import light from './light';
import dark from './dark';

export enum ThemeType {
	light = 'light',
	dark = 'dark'
}

export type ThemesWithCurrentType = ThemeType | 'current';

export type AppTheme = {
	background: string;
	color: string;
};

export const themes: Record<ThemeType, AppTheme> = {
	[ThemeType.light]: light,
	[ThemeType.dark]: dark
};
