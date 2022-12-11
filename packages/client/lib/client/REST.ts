export interface RESTOptions {
    url: string;
}

export class REST {
    public url: URL;
    public token?: string;

    public constructor(options: RESTOptions) {
        this.url = new URL(options.url);
    }

    public setToken(token?: string) {
        this.token = token;
        return this;
    }

    public get(path: string) {
        return this.request(path, 'GET');
    }

    public put(path: string, body: unknown) {
        return this.request(path, 'PUT', body);
    }

    public post(path: string, body: unknown) {
        return this.request(path, 'POST', body);
    }

    public patch(path: string, body: unknown) {
        return this.request(path, 'PATCH', body);
    }

    public delete(path: string) {
        return this.request(path, 'DELETE');
    }

    public async request(path: string, method: string, body?: unknown) {
        const url = new URL(path, this.url);
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: this.token ?? '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) return data;
        throw new Error(data.details ?? data.message);
    }
}
