import { Collection } from '@discordjs/collection';
import type { Client } from '#/client/Client';

export class MapManager<K, V> extends Collection<K, V> {
    public client: Client;

    public constructor(client: Client) {
        super();
        this.client = client;
    }
}

export class ArrayManager<V> extends Array<V> {
    public client: Client;

    public constructor(client: Client) {
        super();
        this.client = client;
    }
}
