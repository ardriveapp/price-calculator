import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import StateProvider from './state/state';
import { reducer } from './state/reducer';

import { UnitBox } from './components/UnitBox.example';

ReactDOM.render(
	<React.StrictMode>
		<StateProvider reducer={reducer}>
			<App />
			{/** These UnitBoxes are only for testing state management PR */}
			<UnitBox field="bytes" />
			<UnitBox field="fiat" />
			<UnitBox field="ar" />
		</StateProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
	import.meta.hot.accept();
}
