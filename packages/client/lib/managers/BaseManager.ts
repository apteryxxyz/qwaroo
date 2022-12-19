/* eslint-disable sonarjs/no-identical-functions */
import { Collection } from '@discordjs/collection';
import { Client } from '#/client/Client';

export class MapManager<K, V> extends Collection<K, V> {
    public client: Client;

    public constructor(client: Client | { client: Client }) {
        super();
        if (client instanceof Client) this.client = client;
        else this.client = client.client;
    }
}

export class ArrayManager<V> extends Array<V> {
    public client: Client;

    public constructor(client: Client | { client: Client }) {
        super();
        if (client instanceof Client) this.client = client;
        else this.client = client.client;
    }
}
