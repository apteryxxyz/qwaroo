import { Client } from '#/client/Client';

/** A base class for all structures. */
export class Base {
    public client: Client;
    public id!: string;

    public constructor(
        client: Client | { client: Client },
        data: { id: string }
    ) {
        if (client instanceof Client) this.client = client;
        else this.client = client.client;
        this.patch(data);
    }

    public clone() {
        return Object.assign(Object.create(this), this);
    }

    public patch(data: { id: string }) {
        this.id = data.id;
        return this;
    }

    public update(data: { id: string }) {
        const clone = this.clone();
        this.patch(data);
        return clone;
    }

    public equals(other: Base | { id: string }) {
        return other.id === this.id;
    }

    public toJSON() {
        return { id: this.id };
    }

    public valueOf() {
        return this.id;
    }

    public get [Symbol.toStringTag]() {
        return 'Base';
    }
}
