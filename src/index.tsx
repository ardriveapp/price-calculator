import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import StateProvider from './state/state';
import { reducer } from './state/reducer';
import { AppThemeProvider } from './components/ThemeProvider';
import { Root } from './components/Root.style';

ReactDOM.render(
	<React.StrictMode>
		<StateProvider reducer={reducer}>
			<AppThemeProvider>
				<Root>
					<App />
				</Root>
			</AppThemeProvider>
		</StateProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
	import.meta.hot.accept();
}
