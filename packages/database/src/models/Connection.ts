/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    ModelOptions,
    Plugins,
    Prop,
    Ref,
    getModelForClass,
} from '@typegoose/typegoose';
import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './User';

@ModelOptions({
    options: { customName: 'Connection' },
    schemaOptions: {
        toJSON: {
            transform(_, record) {
                record.id = record._id;
                delete record._id;
                delete record.__v;
                delete record.tokenData;
                return record;
            },
        },
    },
})
@Plugins(require('mongoose-autopopulate'))
export class Connection {
    public id!: string;

    /** The user this connection belongs to. */
    @Prop({ ref: 'User', required: true, autopopulate: true })
    public user!: Ref<User>;

    /** The ID of the provider this connection is for. */
    @Prop({ required: true })
    public providerId!: string;

    /** The type of this connections provider. */
    @Prop({ required: true })
    public providerType!: 'email' | 'oidc' | 'oauth' | 'credentials';

    /** This connections identifier within the provider. */
    @Prop({ required: true })
    public accountId!: string;

    /** The timestamp when this connection was linked. */
    @Prop({ default: Date.now })
    public linkedTimestamp!: number;

    /** Token data provided by */
    @Prop({ type: () => Token })
    public tokenData: Token = {};

    /** Get the user that this connection belongs to. */
    public async getUser(force = false) {
        if (!force && this.user instanceof User.Model) return this.user;
        return (this.user = (await User.Model.findById(this.user).exec())!);
    }
}

export class Token {
    @Prop()
    public tokenType?: string;

    @Prop()
    public accessToken?: string;

    @Prop()
    public refreshToken?: string;

    @Prop()
    public idToken?: string;

    @Prop()
    public expiresTimestamp?: number;

    @Prop()
    public scope?: string;
}

export namespace Connection {
    export const Model =
        (mongoose.models['Connection'] as ReturnModelType<typeof Connection>) ??
        getModelForClass(Connection);

    export type Entity = {
        [K in keyof Connection]: Connection[K] extends Function
            ? never
            : Connection[K];
    };

    export type Document = DocumentType<Connection>;
}
