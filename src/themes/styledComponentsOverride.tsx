import 'styled-components';
import { ThemeDataType } from '.';

declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface DefaultTheme extends ThemeDataType {}
}
