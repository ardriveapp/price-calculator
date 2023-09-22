import light from './light';
import dark from './dark';

export enum ThemeType {
	light = 'light',
	dark = 'dark'
}

export type ThemeDataType = {
	[ThemeType.light]: AppTheme;
	[ThemeType.dark]: AppTheme;
	current: ThemeType;
	isEmbedded: boolean;
};

export type AppTheme = {
	background: string;
	color: string;
};

export const themes: Record<ThemeType, AppTheme> = {
	[ThemeType.light]: light,
	[ThemeType.dark]: dark
};
