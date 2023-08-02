export interface Fetcher {
	fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response>;
}

export class JSFetcher implements Fetcher {
	fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
		return fetch(input, init);
	}
}
