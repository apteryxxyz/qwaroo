import { EventEmitter } from 'events';
import type { StatusCodes } from '@qwaroo/common';
import { ClientError as Error } from '@qwaroo/common';

export class CDNManager extends EventEmitter {
    /** The host of the api. */
    private readonly _baseUrl: string;
    /** The token used for requests. */
    private _authToken?: string;

    public constructor(options: CDNManager.Options) {
        super();

        this._baseUrl = options.baseUrl;
        this._authToken = options.authToken;
    }

    /** Set the token to use for requests. */
    public setToken(authToken?: string) {
        this._authToken = authToken;
        return this;
    }

    /** Make a GET request. */
    public get(path: string, query = {}) {
        return this._request('GET', path, query);
    }

    /** Make a request. */
    private async _request(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        path: string,
        query?: Record<string, string>
    ) {
        const url = new URL(path, this._baseUrl);
        if (query) {
            const params = new URLSearchParams(query);
            url.search = params.toString();
        }

        const headers = new Headers();
        if (this._authToken) headers.append('Authorisation', this._authToken);

        return fetch(url.toString(), { method, headers })
            .then(async response => {
                if (response.ok) return response.text();
                const code = response.status as keyof typeof StatusCodes;
                const error = new Error(code, response.statusText);
                this.emit('error', error);
                throw error;
            })
            .catch(error => {
                this.emit('refused', error);
                throw error;
            });
    }

    public get [Symbol.toStringTag]() {
        return 'CDNManager';
    }
}

export namespace CDNManager {
    export interface Options {
        baseUrl: string;
        authToken?: string;
    }
}
