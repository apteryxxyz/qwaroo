import type { APIUser, FetchUsersOptions } from '@qwaroo/types';
import { APIRoutes } from '@qwaroo/types';
import { Listing } from './Listing';
import type { UserManager } from '#/managers/UserManager';
import type { User } from '#/structures/User';

export class UserListing extends Listing<FetchUsersOptions, User, APIUser> {
    public manager: UserManager;
    public abortController?: AbortController;

    public constructor(
        manager: UserManager,
        options: FetchUsersOptions,
        total: number
    ) {
        super(manager, options, total);
        this.manager = manager;
    }

    public append(data: APIUser) {
        const user = this.manager.append(data);
        this.set(user.id, user);
        return user;
    }

    public async fetchMore() {
        this.abortController = new AbortController();
        const path = APIRoutes.users();
        const data = await this.client.api.get(
            path,
            {
                limit: 25,
                ...this.options,
                skip: this.size,
            },
            this.abortController.signal
        );

        this.total = data.total;
        return data.items.map((raw: APIUser) => this.append(raw)) as User[];
    }

    public abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    public get [Symbol.toStringTag]() {
        return 'UserLinting';
    }
}
