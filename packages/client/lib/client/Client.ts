import { APIManager } from './APIManager';
import { CDNManager } from './CDNManager';
import { GameManager } from '#/managers/GameManager';
import { UserManager } from '#/managers/UserManager';

/** The API client, used to make connecting to the API easier. */
export class Client {
    /** The API REST manager. */
    public api: APIManager;
    /** The CDN REST manager. */
    public cdn: CDNManager;

    /** The games manager. */
    public games: GameManager;
    /** The users manager. */
    public users: UserManager;

    /** ID of the currently logged in user if at all. */
    public id?: string;

    public hasTriedToPrepare = false;

    public constructor(options: Client.Options) {
        this.api = new APIManager(options.api);
        this.cdn = new CDNManager(options.cdn);

        this.games = new GameManager(this);
        this.users = new UserManager(this);
    }

    /** The currently logged in user. */
    public get me() {
        return this.id ? this.users.get(this.id) : undefined;
    }

    /** Prepare the client. */
    public prepare(id: string, token: string) {
        this.id = id as string;
        this.api.setToken(token);
        this.cdn.setToken(token);
        return this;
    }

    /** Initialise the client. */
    public async login() {
        const user = await this.users.fetchOne(this.id!);
        this.users.set(this.id!, user);
        return this;
    }

    /** Uninitialise this client. */
    public logout() {
        this.id = undefined;
        this.api.setToken(undefined);
        this.cdn.setToken(undefined);
    }

    public get [Symbol.toStringTag]() {
        return 'Client';
    }
}

export namespace Client {
    export interface Options {
        api: APIManager.Options;
        cdn: CDNManager.Options;
    }
}
