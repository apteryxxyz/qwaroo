import { EventEmitter } from 'events';
import { ClientError as Error, Query } from '@qwaroo/common';

export class APIManager extends EventEmitter {
    /** The host of the api. */
    private readonly _baseUrl: string;
    /** The token used for requests. */
    private _authToken?: string;

    public constructor(options: APIManager.Options) {
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
    public get(path: string, query = {}, signal?: AbortSignal) {
        return this._request('GET', path, query, undefined, signal);
    }

    /** Make a POST request. */
    public post(path: string, query = {}, body = {}, signal?: AbortSignal) {
        return this._request('POST', path, query, body, signal);
    }

    /** Make a PUT request. */
    public put(path: string, query = {}, body = {}, signal?: AbortSignal) {
        return this._request('PUT', path, query, body, signal);
    }

    /** Make a PATCH request. */
    public patch(path: string, query = {}, body = {}, signal?: AbortSignal) {
        return this._request('PATCH', path, query, body, signal);
    }

    /** Make a DELETE request. */
    public delete(path: string, query = {}, signal?: AbortSignal) {
        return this._request('DELETE', path, query, undefined, signal);
    }

    /** Make a request. */
    private async _request(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        path: string,
        query?: Record<string, string>,
        body?: Record<string, unknown>,
        signal?: AbortSignal
    ) {
        const url = new URL(path, this._baseUrl);
        if (query) url.search = Query.stringify(query);

        const headers = new Headers();
        if (this._authToken) headers.append('Authorisation', this._authToken);
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');

        this.emit('request', method, path, query, body);
        return fetch(url.toString(), {
            method,
            headers,
            body: JSON.stringify(body),
            signal,
        })
            .then(async response => {
                const data = await response.json();
                if (response.ok) return data;
                const error = Error.fromServer(data);
                this.emit('error', error);
                throw error;
            })
            .catch(error => {
                this.emit('refused', error);
                throw error;
            });
    }

    public get [Symbol.toStringTag]() {
        return 'APIManager';
    }
}

export namespace APIManager {
    export interface Options {
        baseUrl: string;
        authToken?: string;
    }
}
