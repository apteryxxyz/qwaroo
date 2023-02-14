import { Client } from '#/client/Client';
import { Collection } from '#/utilities/Collection';

/** A cache manager to handle key and value caches. */
export class Manager<K, V> extends Collection<K, V> {
    public client: Client;

    public constructor(client: Client | { client: Client }) {
        super();
        if (client instanceof Client) this.client = client;
        else this.client = client.client;
    }

    public get [Symbol.toStringTag]() {
        return 'Manager';
    }
}
