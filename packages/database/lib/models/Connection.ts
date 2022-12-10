import type { Connection as ConnectionEntity } from '@owenii/types';
import { Validate } from '@owenii/validators';
import type { Document, Model } from 'mongoose';
import { Schema, model } from 'mongoose';
import { User, type UserDocument } from './User';

export interface ConnectionDocument extends ConnectionEntity, Document {
    id: string;
}

export interface ConnectionMethods {
    getUser(): Promise<UserDocument>;
}

export interface ConnectionModel
    extends Model<ConnectionEntity, {}, ConnectionMethods> {}

const ConnectionSchema = new Schema<
    ConnectionEntity,
    ConnectionModel,
    undefined,
    ConnectionMethods
>(
    {
        userId: {
            type: String,
            required: true,
            match: Validate.ObjectId,
        },

        providerName: {
            type: String,
            required: true,
        },

        accountId: {
            type: String,
            required: true,
        },

        accountUsername: {
            type: String,
            required: true,
        },

        linkedTimestamp: {
            type: Number,
            required: true,
            default: Date.now,
        },

        refreshToken: {
            type: String,
            required(this: ConnectionDocument) {
                return this.providerName === 'discord';
            },
        },
    },
    {
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.refreshToken;
                return ret;
            },
        },
        virtuals: true,
    }
);

ConnectionSchema.method('getUser', function _(this: ConnectionDocument) {
    return User.findOne({ id: this.userId }).exec();
});

export const Connection = model<ConnectionEntity, ConnectionModel>(
    'Connection',
    ConnectionSchema
);
