import * as React from 'react';
export const faqQuestionsAnswers = [
	{
		question: 'How much storage do I need?',
		answer: (
			<>
				<p>
					A little bit of money can go a long way in data storage. As you can see with the price calculator
					for a small amount of USD you can purchase storage for hundreds of documents or dozens of photos or
					songs.
				</p>
				<p>
					Files of the same type (docs, jpegs, or mp3) will vary in sizes, but some rules of thumb are: 1
					document 0.31 MB (320KB); 1 HD Photo 2.5 MB; 3.5 minute Song 3.5 MB; 1 minute HD video 100 MB.
				</p>
			</>
		)
	},
	{
		question: 'How are fees calculated?',
		answer: (
			<>
				<p>
					The file size is used to determine the base fee to upload data to the network. The price of the base
					fee is set by the Arweave Network code itself. The Price Calculator includes this base fee and adds
					the ArDrive Community Tip percentage on top. Learn more about{' '}
					<a href="https://ardrive.atlassian.net/wiki/spaces/help/pages/86376465">ArDrive Fees</a>.
				</p>
				<p> Note: All file sizes are represented using binary units of measurement (i.e. 1 MB = 1024 KB).</p>
			</>
		)
	},
	{
		question: 'What is AR?',
		answer: (
			<>
				<p>
					AR is the name of the cryptocurrency used to upload data onto the Arweave network. Similar to having
					to pay USD when in the United States, many crypto blockchains have their own currency that you are
					required to use when you are in their ‘land’.{' '}
				</p>
				<p>
					Therefore, ArDrive users must have a wallet with AR tokens in it to pay for data they upload. Learn
					more about <a href="https://ardrive.io/what-is-arweave/">Arweave tokens</a>.
				</p>
			</>
		)
	},
	{
		question: 'Is the price of data consistent?',
		answer: (
			<>
				<p>
					Not exactly. The Arweave network protocol is always adjusting the data price to maintain
					sustainable, perpetual storage. The data price is lowered as the network increases its overall
					capacity.
				</p>
				<p>
					This can result in a fluctuating data price. However, for most files these fluctuations would only
					increase or decrease costs by fractions of a cent.
				</p>
			</>
		)
	},
	{
		question: 'How do I know how big a file is?',
		answer: (
			<p>
				In ArDrive, before any files are uploaded to the network, we calculate their size and estimate the price
				to upload. Before it is paid for and stored permanently, you must approve the upload. This ensures you
				are only uploading the right data for the right price.
			</p>
		)
	}
];
