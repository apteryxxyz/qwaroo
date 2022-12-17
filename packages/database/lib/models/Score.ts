import { Validate } from '@owenii/common';
import type { Score as ScoreEntity } from '@owenii/types';
import type { Document, Model } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Game, type GameDocument } from './Game';
import { User, type UserDocument } from './User';

export interface ScoreMethods {
    getUser(): Promise<UserDocument>;
    getGame(): Promise<GameDocument>;
}

export interface ScoreDocument extends ScoreEntity, ScoreMethods, Document {
    id: string;
}

export interface ScoreModel extends Model<ScoreEntity, {}, ScoreMethods> {}

const ScoreSchema = new Schema<
    ScoreEntity,
    ScoreModel,
    undefined,
    ScoreMethods
>(
    {
        userId: {
            type: String,
            required: true,
            match: Validate.ObjectId,
        },

        gameId: {
            type: String,
            required: true,
            match: Validate.ObjectId,
        },

        highScore: {
            type: Number,
            required: false,
        },

        highScoreTime: {
            type: Number,
            required: false,
        },

        highScoreTimestamp: {
            type: Number,
            required: false,
        },

        totalScore: {
            type: Number,
            required: true,
            default: 0,
        },

        totalTime: {
            type: Number,
            required: true,
            default: 0,
        },

        totalPlays: {
            type: Number,
            required: true,
            default: 0,
        },

        firstPlayedTimestamp: {
            type: Number,
            required: true,
            default: Date.now(),
        },

        lastPlayedTimestamp: {
            type: Number,
            required: true,
            default: Date.now(),
        },
    },
    {
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

ScoreSchema.method('getUser', function getUser(this: ScoreDocument) {
    return User.findById(this.userId);
});

ScoreSchema.method('getGame', function getGame(this: ScoreDocument) {
    return Game.findById(this.gameId);
});

export const Score = model<ScoreEntity, ScoreModel>('Score', ScoreSchema);
