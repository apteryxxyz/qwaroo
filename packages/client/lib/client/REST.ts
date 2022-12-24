import { ClientError as Error } from '@qwaroo/common';

/** The REST manager, handles making requests. */
export class REST {
    /** The host of the api. */
    public apiHost: string | URL;
    /** The token to use for requests. */
    public apiToken?: string;

    public constructor(options: REST.Options) {
        this.apiHost = new URL('', options.apiHost);
    }

    /** Set the token to use for requests. */
    public setToken(token?: string) {
        this.apiToken = token;
        return this;
    }

    /** Make a GET request. */
    public get(path: string, query = {}) {
        return this._request(path, 'GET', query);
    }

    /** Make a POST request. */
    public post(path: string, query = {}, body = {}) {
        return this._request(path, 'POST', query, body);
    }

    /** Make a PUT request. */
    public put(path: string, query = {}, body = {}) {
        return this._request(path, 'PUT', query, body);
    }

    /** Make a PATCH request. */
    public patch(path: string, query = {}, body = {}) {
        return this._request(path, 'PATCH', query, body);
    }

    /** Make a DELETE request. */
    public delete(path: string, query = {}) {
        return this._request(path, 'DELETE', query);
    }

    /** Make a request. */
    private async _request(
        path: string,
        method: string,
        query?: Record<string, unknown>,
        body?: Record<string, unknown>
    ) {
        const url = new URL(path, this.apiHost);
        if (query)
            for (const [key, value] of Object.entries(query))
                url.searchParams.set(key, String(value ?? ''));

        const response = await fetch(url, {
            method,
            headers: {
                Authorization: this.apiToken ?? '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) return data;
        throw Error.fromServer(data);
    }
}

export namespace REST {
    export interface Options {
        apiHost: string | URL;
    }
}
