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

export function tokenIdToThirdParty<T extends TokenID>(token: T): TokenIDToThirdParty<T> {
	return standardToThirdPartyTokenMapping[token];
}

export function fiatIdToThirdParty<F extends FiatID>(fiat: F): FiatIDToThirdParty<F> {
	return standardToThirdPartyFiatMapping[fiat];
}

export type TokenIDToThirdParty<T extends TokenID> = typeof standardToThirdPartyTokenMapping[T];

export type FiatIDToThirdParty<F extends FiatID> = typeof standardToThirdPartyFiatMapping[F];
