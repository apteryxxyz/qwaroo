import { ModelOptions, Prop, getModelForClass } from '@typegoose/typegoose';
import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';

@ModelOptions({
    options: { customName: 'User' },
    schemaOptions: {
        toJSON: {
            transform(_, record) {
                record.id ??= record._id?.toString();
                delete record._id;
                delete record.__v;
                delete record.emailAddress;
                delete record.emailVerifiedTimestamp;
                return record;
            },
        },
    },
})
export class User {
    public id!: string;

    /** A display name, does not need to be unique. */
    @Prop({ required: true })
    public displayName!: string;

    /** The users email address. */
    @Prop({ required: true, unique: true })
    public emailAddress!: string;

    /** Exists if the user logged in with an email provider. */
    @Prop()
    public emailVerifiedTimestamp?: number;

    /** A URL to the users avatar if it exists. */
    @Prop()
    public avatarUrl?: string;

    /** The date when this user joined. */
    @Prop({ default: Date.now })
    public joinedAt!: Date;

    /** The date when this user was last active. */
    @Prop({ default: Date.now })
    public lastSeenAt!: Date; // NOTE: Not currently used
}

export namespace User {
    export const Model =
        (mongoose.models['User'] as ReturnModelType<typeof User>) ??
        getModelForClass(User);

    export type Entity = {
        [K in keyof Omit<
            User,
            'emailAddress' | 'emailVerifiedTimestamp'
        >]: User[K] extends Function ? never : User[K];
    };

    export type Document = DocumentType<User>;
}
