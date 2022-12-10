import type { User as UserEntity } from '@owenii/types';
import { Validate } from '@owenii/validators';
import type { Document, Model } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Connection, type ConnectionDocument } from './Connection';

export interface UserDocument extends UserEntity, Document {
    id: string;
}

export interface UserMethods {
    getConnections(): Promise<ConnectionDocument[]>;
    getConnection(id: string): Promise<ConnectionDocument | null>;
}

export interface UserModel extends Model<UserEntity, {}, UserMethods> {}

const UserSchema = new Schema<UserEntity, UserModel, undefined, UserMethods>(
    {
        revokeToken: {
            type: String,
            required: true,
            default: () => new Date().getMilliseconds().toString(),
        },

        displayName: {
            type: String,
            required: true,
            match: Validate.DisplayName,
        },

        avatarUrl: {
            type: String,
            required: true,
            match: Validate.AvatarUrl,
        },

        joinedTimestamp: {
            type: Number,
            required: true,
            default: Date.now,
        },

        seenTimestamp: {
            type: Number,
            required: true,
            default: Date.now,
        },
    },
    {
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.revokeToken;
                return ret;
            },
        },
    }
);

UserSchema.method(
    'getConnections',
    function getConnections(this: UserDocument) {
        return Connection.find({ userId: this.id }).exec();
    }
);

UserSchema.method(
    'getConnection',
    function getConnection(this: UserDocument, id: string) {
        return Connection.findById(id).exec();
    }
);

export const User = model<UserEntity, UserModel>('User', UserSchema);
