import { Validate } from '@qwaroo/common';
import type * as Types from '@qwaroo/types';
import * as Mongoose from 'mongoose';
import { Game } from './Game';
import { User } from './User';

export namespace Score {
    export interface Methods {
        /** Get the user that this score belongs to. */
        getUser(): Promise<User.Document>;
        /** Get the game that this score is for. */
        getGame(): Promise<Game.Document>;
    }

    export interface Document
        extends Types.Score.Entity,
            Methods,
            Mongoose.Document {
        id: string;
    }

    export interface Model
        extends Mongoose.Model<Types.Score.Entity, {}, Methods> {}

    export const Schema = new Mongoose.Schema<
        Types.Score.Entity,
        Model,
        undefined,
        Methods
    >(
        {
            userId: { type: String, required: true, match: Validate.ObjectId },
            gameId: { type: String, required: true, match: Validate.ObjectId },

            highScore: { type: Number, default: 0 },
            highScoreTime: { type: Number, default: 0 },
            highScorePlayedTimestamp: { type: Number, default: 0 },

            totalScore: { type: Number, default: 0 },
            totalTime: { type: Number, default: 0 },
            totalPlays: { type: Number, default: 0 },

            lastScore: { type: Number, default: 0 },
            lastTime: { type: Number, default: 0 },
            lastPlayedTimestamp: { type: Number, default: 0 },

            firstPlayedTimestamp: { type: Number, default: Date.now },
        },
        {
            toJSON: {
                transform(_, record) {
                    record.id = record._id;
                    delete record._id;
                    delete record.__v;
                    return record;
                },
            },
        }
    );

    Schema.method('getUser', function getUser(this: Document) {
        return User.Model.findById(this.userId);
    });

    Schema.method('getGame', function getGame(this: Document) {
        return Game.Model.findById(this.gameId);
    });

    export const Model = Mongoose.model<Types.Score.Entity, Model>(
        'Score',
        Schema
    );
}
