/* eslint-disable sonarjs/no-identical-functions */
import { Collection } from '@discordjs/collection';
import { Client } from '#/client/Client';

/** A cache manager to handle key and value caches. */
export class MapManager<K, V> extends Collection<K, V> {
    public client: Client;

    public constructor(client: Client | { client: Client }) {
        super();
        if (client instanceof Client) this.client = client;
        else this.client = client.client;
    }
}

/** A cache manager to handle value only caches. */
export class ArrayManager<V> extends Array<V> {
    public client: Client;

    public constructor(client: Client | { client: Client }) {
        super();
        if (client instanceof Client) this.client = client;
        else this.client = client.client;
    }
}
