/* eslint-disable sonarjs/no-identical-functions */
import { Client } from '#/client/Client';
import { Collection } from '#/utilities/Collection';

export class Listing<
    O extends {},
    V extends { toJSON(): R },
    R extends {}
> extends Collection<string, V> {
    public readonly client: Client;
    public readonly options: O;
    public total: number;

    public constructor(
        client: Client | { client: Client },
        options: O,
        total: number
    ) {
        super();
        if (client instanceof Client) this.client = client;
        else this.client = client.client;

        this.options = options;
        this.total = total;
    }

    public get hasMore() {
        return this.total === -1 || this.size < this.total;
    }

    public toArray() {
        return Array.from(this.values());
    }

    public toJSON() {
        return {
            items: this.toArray().map(val => val.toJSON()),
            total: this.total,
            options: this.options,
        };
    }

    public get [Symbol.toStringTag]() {
        return 'Listing';
    }
}

export class ValueListing<O extends {}, V> extends Array<V> {
    public readonly client: Client;
    public readonly options: O;
    public total: number;

    public constructor(
        client: Client | { client: Client },
        options: O,
        total: number
    ) {
        super();
        if (client instanceof Client) this.client = client;
        else this.client = client.client;

        this.options = options;
        this.total = total;
    }

    public get hasMore() {
        return this.total === -1 || this.length < this.total;
    }

    public toArray() {
        return Array.from(this);
    }

    public toJSON() {
        return {
            items: this.toArray(),
            total: this.total,
            options: this.options,
        };
    }

    public get [Symbol.toStringTag]() {
        return 'ValueListing';
    }
}
