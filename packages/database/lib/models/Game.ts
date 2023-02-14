import { Slug, Validate } from '@qwaroo/common';
import * as Types from '@qwaroo/types';
import * as Mongoose from 'mongoose';
import { Score } from './Score';
import { User } from './User';

export namespace Game {
    export interface Methods {
        /** Get the user that created this game. */
        getCreator(): Promise<User.Document>;
        /** Get all of the user scores for this game. */
        getScores(): Promise<Score.Document[]>;
    }

    export interface Document
        extends Types.Game.Entity,
            Methods,
            Mongoose.Document {
        id: string;
    }

    export interface Model
        extends Mongoose.Model<Types.Game.Entity, {}, Methods> {}

    export const Schema = new Mongoose.Schema<
        Types.Game.Entity,
        Model,
        undefined,
        Methods
    >(
        {
            slug: {
                type: String,
                required: true,
                unique: true,
                match: Validate.Slug,
                default(this: Document) {
                    return Slug.createWithTransliteration(this.title);
                },
            },
            creatorId: {
                type: String,
                required: true,
                match: Validate.ObjectId,
            },

            mode: { type: String, required: true, enum: Types.Game.Mode },
            title: { type: String, required: true, match: Validate.Title },
            shortDescription: {
                type: String,
                required: true,
                match: Validate.ShortDescription,
            },
            longDescription: {
                type: String,
                required: true,
                match: Validate.LongDescription,
            },
            thumbnailUrl: {
                type: String,
                required: true,
                match: Validate.ThumbnailURL,
            },
            categories: { type: [String], default: [] },
            flags: { type: Number, default: Types.Game.Flags.None },
            extraData: { type: Object, default: {} },

            highScore: { type: Number, default: 0 },
            highScoreTime: { type: Number, default: 0 },
            highScorePlayedTimestamp: { type: Number, default: 0 },

            totalScore: { type: Number, default: 0 },
            totalTime: { type: Number, default: 0 },
            totalPlays: { type: Number, default: 0 },

            lastScore: { type: Number, default: 0 },
            lastTime: { type: Number, default: 0 },
            lastPlayedTimestamp: { type: Number, default: 0 },

            createdTimestamp: { type: Number, default: Date.now },
            updatedTimestamp: { type: Number, default: Date.now },
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

    Schema.method('getCreator', function getCreator(this: Document) {
        return User.Model.findById(this.creatorId).exec();
    });

    Schema.method('getScores', function getScores(this: Document) {
        return Score.Model.find({ gameId: this.id }).exec();
    });

    export const Model = Mongoose.model<Types.Game.Entity, Model>(
        'Game',
        Schema
    );
}
