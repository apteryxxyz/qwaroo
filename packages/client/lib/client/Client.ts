import { REST } from './REST';
import { GameManager } from '#/managers/GameManager';
import { UserManager } from '#/managers/UserManager';
import { User } from '#/structures/User';

export class Client<Ready extends boolean = boolean> {
    public rest: REST;
    public id!: Ready extends true ? string : undefined;

    public users: UserManager;
    public games: GameManager;

    public constructor(options: Client.Options) {
        this.rest = new REST(options);

        this.users = new UserManager(this);
        this.games = new GameManager(this);
    }

    public get me(): Ready extends true ? User : undefined {
        // @ts-expect-error 2322
        return this.id && this.users.get(this.id);
    }

    public isLoggedIn(): this is Client<true> {
        return this.me !== undefined;
    }

    public async login(id: string, token: string) {
        // @ts-expect-error 2322
        this.id = id as string;
        this.rest.setToken(token);

        const user = new User(this, { id });
        this.users.set(user.id, user);
        if (user.partial) await user.fetch();

        return this;
    }

    public async logout() {
        this.rest.setToken(undefined);
        // @ts-expect-error 2322
        this.id = undefined;
    }
}

export namespace Client {
    export interface Options extends REST.Options {}
}
