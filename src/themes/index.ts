import light from './light';
import dark from './dark';

export enum ThemeType {
	light = 'light',
	dark = 'dark'
}

export type ThemeDataType = {
	[ThemeType.light]: AppTheme;
	[ThemeType.dark]: AppTheme;
	current: AppTheme;
	themeName: ThemeType;
	isEmbedded: boolean;
};

export type AppTheme = {
	backgroundColor: string;
	borderColorSelected: string;
	boxShadow: string;
	boxShadowSelected: string;
	dividerColor: string;
	dottedDividerBckgroundImage: string;
	dropdownHoverColor: string;
	textColor: string;
};

export const themes: Record<ThemeType, AppTheme> = {
	[ThemeType.light]: light,
	[ThemeType.dark]: dark
};
