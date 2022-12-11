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
        slug: {
            type: String,
            required: true,
            unique: true,
            validate: Validate.Slug,
        },

        type: {
            type: Number,
            required: true,
        },

        title: {
            type: String,
            required: true,
            validate: Validate.Title,
        },

        shortDescription: {
            type: String,
            required: true,
            validate: Validate.ShortDescription,
        },

        longDescription: {
            type: String,
            required: true,
            validate: Validate.LongDescription,
        },

        thumbnailUrl: {
            type: String,
            required: true,
            validate: Validate.ThumbnailUrl,
        },

        categories: {
            type: [String],
            required: true,
        },

        data: {
            type: Schema.Types.Mixed,
            required: true,
        },

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
