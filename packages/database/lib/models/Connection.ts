import { Validate } from '@owenii/common';
import type { Connection as ConnectionEntity } from '@owenii/types';
import type { Document, Model } from 'mongoose';
import { Schema, model } from 'mongoose';
import { User, type UserDocument } from './User';

export interface ConnectionMethods {
    getUser(): Promise<UserDocument>;
}

export interface ConnectionDocument
    extends ConnectionEntity,
        ConnectionMethods,
        Document {
    id: string;
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
            unique: true,
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
            required: true,
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
    }
);

ConnectionSchema.method('getUser', function getUser(this: ConnectionDocument) {
    return User.findById(this.userId).exec();
});

export const Connection = model<ConnectionEntity, ConnectionModel>(
    'Connection',
    ConnectionSchema
);
