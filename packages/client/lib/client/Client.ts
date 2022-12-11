import { REST, type RESTOptions } from './REST';
import { UserManager } from '#/managers/UserManager';
import { User } from '#/structures/User';

interface ClientOptions extends RESTOptions {}

export class Client<Ready extends boolean = boolean> {
    public rest: REST;
    public id!: Ready extends true ? string : undefined;
    public users: UserManager;

    public constructor(options: ClientOptions) {
        this.rest = new REST(options);
        this.users = new UserManager(this);
    }

    public get me(): Ready extends true ? User : undefined {
        // @ts-expect-error 2322
        return this.users.get(this.id ?? '');
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
        this.users.clear();
        // @ts-expect-error 2322
        this.id = undefined;
    }
}
