import { REST } from './REST';
import { GameManager } from '#/managers/GameManager';
import { UserManager } from '#/managers/UserManager';
import { User } from '#/structures/User';

/** The API client, used to make connecting to the API easier. */
export class Client<R extends boolean = boolean> {
    /** The REST manager. */
    public rest: REST;
    /** ID of the currently logged in user if at all. */
    public id!: R extends true ? string : undefined;
    /** The users manager. */
    public users: UserManager;
    /** The games manager. */
    public games: GameManager;

    public constructor(options: Client.Options) {
        this.rest = new REST(options);

        this.users = new UserManager(this);
        this.games = new GameManager(this);
    }

    /** The currently logged in user. */
    public get me(): R extends true ? User : undefined {
        // @ts-expect-error 2322
        return this.id && this.users.get(this.id);
    }

    /** Whether the client is logged in. */
    public isLoggedIn(): this is Client<true> {
        return this.me !== undefined;
    }

    /** Initialise this client. */
    public async login(id: string, token: string) {
        // @ts-expect-error 2322
        this.id = id as string;
        this.rest.setToken(token);

        const user = new User(this, { id });
        this.users.set(user.id, user);
        if (user.partial) await user.fetch();

        return this;
    }

    /** Uninitialise this client. */
    public async logout() {
        this.rest.setToken(undefined);
        // @ts-expect-error 2322
        this.id = undefined;
    }
}

export namespace Client {
    export interface Options extends REST.Options {}
}
