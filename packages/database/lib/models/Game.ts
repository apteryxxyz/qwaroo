import type { Game as GameEntity } from '@owenii/types';
import { Validate } from '@owenii/validators';
import type { Document, Model } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface GameDocument extends GameEntity, Document {
    id: string;
}

export interface GameMethods {}

export interface GameModel extends Model<GameEntity, {}, GameMethods> {}

const GameSchema = new Schema<GameEntity, GameModel, undefined, GameMethods>(
    {
        // Identifers
        slug: {
            type: String,
            required: true,
            unique: true,
            match: Validate.Slug,
        },

        // Creator
        creatorId: {
            type: String,
            required: true,
            match: Validate.ObjectId,
        },

        // Updater
        sourceId: {
            type: String,
        },

        sourceOptions: {
            type: Schema.Types.Mixed,
        },

        // Information
        type: {
            type: Number,
            required: true,
        },

        title: {
            type: String,
            required: true,
            match: Validate.Title,
        },

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
            match: Validate.ThumbnailUrl,
        },

        categories: {
            type: [String],
            required: true,
        },

        data: {
            type: Schema.Types.Mixed,
            required: true,
        },

        // Timestamps
        createdTimestamp: {
            type: Number,
            required: true,
            default: Date.now,
        },

        updatedTimestamp: {
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
                return ret;
            },
        },
    }
);

export const Game = model<GameEntity, GameModel>('Game', GameSchema);