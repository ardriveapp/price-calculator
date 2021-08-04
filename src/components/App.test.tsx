import { render } from '@testing-library/react';
import { expect } from 'chai';
import * as React from 'react';
import { stub } from 'sinon';

import App from './App';

describe('<App>', () => {
	// Test if React is working
	it('renders hello world', () => {
		const { getByText } = render(<App />);
		const linkElement = getByText(/Hello World, React/);
		expect(document.body.contains(linkElement));
	});

	// Test if sinon is working
	it('can be stubbed out with sinon', () => {
		// Wrap in object for easier Sinon usage
		const appObject = { App };

		// Returns stubbed div
		const stubbedApp = stub(appObject, 'App').returns(<div className="App">Goodbye World</div>);

		// Run test as normal
		const { getByText } = render(appObject.App());
		const linkElement = getByText(/Goodbye World/);

		expect(document.body.contains(linkElement));
		expect(stubbedApp.calledOnce).to.be.true;
	});
});
