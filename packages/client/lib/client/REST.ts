import { ClientError as Error } from '@owenii/errors';

export class REST {
    public apiHost: string | URL;
    public apiToken?: string;

    public constructor(options: REST.Options) {
        this.apiHost = new URL('', options.apiHost);
    }

    public setToken(token?: string) {
        this.apiToken = token;
        return this;
    }

    public get(path: string, query = {}) {
        return this._request(path, 'GET', query);
    }

    public post(path: string, query = {}, body = {}) {
        return this._request(path, 'POST', query, body);
    }

    public put(path: string, query = {}, body = {}) {
        return this._request(path, 'PUT', query, body);
    }

    public patch(path: string, query = {}, body = {}) {
        return this._request(path, 'PATCH', query, body);
    }

    public delete(path: string, query = {}) {
        return this._request(path, 'DELETE', query);
    }

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
