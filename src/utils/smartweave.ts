import Arweave from 'arweave';
import { readContract } from 'smartweave';
import { communityTxId } from './constants';

// Initialize Arweave
export const arweave = Arweave.init({
	host: 'arweave.net', // Arweave Gateway
	//host: 'arweave.dev', // Arweave Dev Gateway
	port: 443,
	protocol: 'https',
	timeout: 600000
});

// Gets a random ArDrive token holder based off their weight (amount of tokens they hold)
export async function selectTokenHolder(): Promise<string | undefined> {
	// Read the ArDrive Smart Contract to get the latest state
	const state = await readContract(arweave, communityTxId);
	const balances = state.balances;
	const vault = state.vault;

	// Get the total number of token holders
	let total = 0;
	for (const addr of Object.keys(balances)) {
		total += balances[addr];
	}

	// Check for how many tokens the user has staked/vaulted
	for (const addr of Object.keys(vault)) {
		if (!vault[addr].length) continue;

		const vaultBalance = vault[addr]
			.map((a: { balance: number; start: number; end: number }) => a.balance)
			.reduce((a: number, b: number) => a + b, 0);

		total += vaultBalance;

		if (addr in balances) {
			balances[addr] += vaultBalance;
		} else {
			balances[addr] = vaultBalance;
		}
	}

	// Create a weighted list of token holders
	const weighted: { [addr: string]: number } = {};
	for (const addr of Object.keys(balances)) {
		weighted[addr] = balances[addr] / total;
	}
	// Get a random holder based off of the weighted list of holders
	const randomHolder = weightedRandom(weighted);
	return randomHolder;
}

// Used by the selectWeightedRanom function to determine who receives a tip
export function weightedRandom(dict: Record<string, number>): string | undefined {
	let sum = 0;
	const r = Math.random();

	for (const addr of Object.keys(dict)) {
		sum += dict[addr];
		if (r <= sum && dict[addr] > 0) {
			return addr;
		}
	}
	return;
}
