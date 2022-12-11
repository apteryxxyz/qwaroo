import { Collection } from '@discordjs/collection';
import type { Client } from '#/client/Client';

export class BaseManager<K, V> extends Collection<K, V> {
    public client: Client;

    public constructor(client: Client) {
        super();
        this.client = client;
    }
}
