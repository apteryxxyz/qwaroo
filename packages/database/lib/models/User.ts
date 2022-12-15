import { Validate } from '@owenii/common';
import type { User as UserEntity } from '@owenii/types';
import type { Document, Model } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Connection, type ConnectionDocument } from './Connection';
import { Game, type GameDocument } from './Game';
import { Score, type ScoreDocument } from './Score';

export interface UserDocument extends UserEntity, Document {
    id: string;
}

export interface UserMethods {
    getConnections(): Promise<ConnectionDocument[]>;
    getConnection(id: string): Promise<ConnectionDocument | null>;
    getGames(): Promise<GameDocument[]>;
    getGame(id: string): Promise<GameDocument | null>;
    getScores(): Promise<ScoreDocument[]>;
    getScore(id: string): Promise<ScoreDocument | null>;
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
            match: Validate.AvatarURL,
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

UserSchema.method('getGames', function getGames(this: UserDocument) {
    return Game.find({ userId: this.id }).exec();
});

UserSchema.method('getGame', function getGame(this: UserDocument, id: string) {
    return Game.findById(id).exec();
});

UserSchema.method('getScores', function getScores(this: UserDocument) {
    return Score.find({ userId: this.id }).exec();
});

export const User = model<UserEntity, UserModel>('User', UserSchema);
