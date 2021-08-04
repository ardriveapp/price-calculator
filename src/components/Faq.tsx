import * as React from 'react';
import Expandable from './Expandable';
import { FaqContainer } from './Faq.style';

export default function Faq(): JSX.Element {
	return (
		<FaqContainer>
			<h1>FAQ</h1>
			<Expandable
				title={'How are fees calculated?'}
				description={
					'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'
				}
			></Expandable>
			<Expandable
				title={'What is AR?'}
				description={
					'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'
				}
			></Expandable>
			<Expandable
				title={'Is the price of data consistent?'}
				description={
					'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'
				}
			></Expandable>
			<Expandable
				title={'How do I know how big a file is?'}
				description={
					'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'
				}
			></Expandable>
		</FaqContainer>
	);
}
