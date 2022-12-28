import { Validate } from '@qwaroo/common';
import type { User as UserEntity } from '@qwaroo/types';
import type { Document, Model } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Connection, type ConnectionDocument } from './Connection';
import { Game, type GameDocument } from './Game';
import { Score, type ScoreDocument } from './Score';

export interface UserMethods {
    /** Get the list of connections linked to this user. */
    getConnections(): Promise<ConnectionDocument[]>;
    /** Get a specific connection that is linked to this user. */
    getConnection(id: string): Promise<ConnectionDocument | null>;

    /** Get the games that this user has created. */
    getGames(): Promise<GameDocument[]>;
    /** Get a specific game that this user has created. */
    getGame(id: string): Promise<GameDocument | null>;

    /** Get the scores that this user has submitted. */
    getScores(): Promise<ScoreDocument[]>;
}

export interface UserDocument extends UserEntity, UserMethods, Document {
    id: string;
}

export interface UserModel extends Model<UserEntity, {}, UserMethods> {}

const UserSchema = new Schema<UserEntity, UserModel, undefined, UserMethods>(
    {
        // Information
        displayName: {
            type: String,
            required: true,
            match: Validate.DisplayName,
        },

        avatarUrl: {
            type: String,
            required: true,
            match: Validate.AvatarURL,
        },

        // Flags
        flags: {
            type: Number,
            required: true,
            default: 0,
        },

        // Security
        revokeToken: {
            type: String,
            required: true,
            default: () => new Date().getMilliseconds().toString(),
        },

        // Timestamps
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

UserSchema.method('getGames', function getGames(this: UserDocument) {
    return Game.find({ userId: this.id }).exec();
});

UserSchema.method('getGame', function getGame(this: UserDocument, id: string) {
    return Game.findById(id).exec();
});

UserSchema.method('getScores', function getScores(this: UserDocument) {
    return Score.find({ userId: this.id }).exec();
});

// If the user's display name is invalid, set it to their ID
UserSchema.pre('validate', function setDisplayName(this: UserDocument) {
    if (!Validate.DisplayName.test(this.displayName))
        this.displayName = this.id;
});

export const User = model<UserEntity, UserModel>('User', UserSchema);
