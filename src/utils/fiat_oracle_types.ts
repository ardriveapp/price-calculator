const standardToThirdPartyTokenMapping = {
	ARWEAVE: 'arweave'
} as const;

/* To retreive more values go:
 * $ curl -X 'GET' \
 *   'https://api.coingecko.com/api/v3/simple/supported_vs_currencies' \
 *   -H 'accept: application/json'
 */
const standardToThirdPartyFiatMapping = {
	USD: 'usd'
} as const;

export type TokenID = keyof typeof standardToThirdPartyTokenMapping;
export type FiatID = keyof typeof standardToThirdPartyFiatMapping;

export function tokenIdToThirdParty(token: TokenID): string {
	return standardToThirdPartyTokenMapping[token];
}

export function fiatIdToThirdParty(fiat: FiatID): string {
	return standardToThirdPartyFiatMapping[fiat];
}
