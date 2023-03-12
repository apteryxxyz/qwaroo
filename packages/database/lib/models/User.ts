import { Validate } from '@qwaroo/common';
import * as Types from '@qwaroo/types';
import * as Mongoose from 'mongoose';
import { Connection } from './Connection';
import { Game } from './Game';
import { Score } from './Score';

export namespace User {
    export interface Methods {
        /** Get the connection for this user. */
        getConnection(): Promise<Connection.Document>;

        /** Get the games that this user has created. */
        getGames(): Promise<Game.Document[]>;
        /** Get a specific game that this user has created. */
        getGame(id: string): Promise<Game.Document | null>;

        /** Get the scores that this user has submitted. */
        getScores(): Promise<Score.Document[]>;
    }

    export interface Document
        extends Types.User.Entity,
            Methods,
            Mongoose.Document {
        id: string;
    }

    export interface Model
        extends Mongoose.Model<Types.User.Entity, {}, Methods> {}

    export const Schema = new Mongoose.Schema<
        Types.User.Entity,
        Model,
        undefined,
        Methods
    >(
        {
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
            flags: {
                type: Number,
                default: Types.User.Flags.None,
            },

            revokeToken: {
                type: String,
                required: true,
                default: () => new Date().getMilliseconds().toString(),
            },

            joinedTimestamp: { type: Number, default: Date.now },
            lastSeenTimestamp: { type: Number, default: Date.now },
        },
        {
            toJSON: {
                transform(_, record) {
                    record.id = record._id;
                    delete record._id;
                    delete record.__v;
                    delete record.revokeToken;
                    return record;
                },
            },
        }
    );

    Schema.method('getConnection', function getConnection(this: Document) {
        return Connection.Model.findOne({ userId: this.id }).exec();
    });

    Schema.method('getGames', function getGames(this: Document) {
        return Game.Model.find({ userId: this.id }).exec();
    });

    Schema.method('getGame', function getGame(this: Document, id: string) {
        return Game.Model.findById(id).exec();
    });

    Schema.method('getScores', function getScores(this: Document) {
        return Score.Model.find({ userId: this.id }).exec();
    });

    // If the user's display name is invalid, set it to their ID
    Schema.pre('validate', function setDisplayName(this: Document) {
        if (!Validate.DisplayName.test(this.displayName))
            this.displayName = this.id;
    });

    export const Model = Mongoose.model<Types.User.Entity, Model>(
        'User',
        Schema
    );
}
