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
    options: { customName: 'Session' },
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
export class Session {
    public id!: string;

    /** The user this session belongs to. */
    @Prop({ ref: 'User', required: true, autopopulate: true })
    public user!: Ref<User>;

    /** The token for this session. */
    @Prop({ required: true })
    public sessionToken!: string;

    /** The timestamp when this session was created. */
    @Prop({ required: true })
    public createdTimestamp: number = Date.now();

    /** The timestamp when this session will expire. */
    @Prop({ required: true })
    public expiresTimestamp!: number;

    /** Get the user that this session belongs to. */
    public async getUser(force = false) {
        if (!force && this.user instanceof User.Model) return this.user;
        return (this.user = (await User.Model.findById(this.user).exec())!);
    }
}

export namespace Session {
    export const Model =
        (mongoose.models['Session'] as ReturnModelType<typeof Session>) ??
        getModelForClass(Session);

    export type Entity = {
        [K in keyof Session]: Session[K] extends Function ? never : Session[K];
    };

    export type Document = DocumentType<Session>;
}
