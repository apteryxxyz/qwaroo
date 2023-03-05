import { Validate } from '@qwaroo/common';
import type * as Types from '@qwaroo/types';
import * as Mongoose from 'mongoose';
import { User } from './User';

export namespace Connection {
    export interface Methods {
        /** Get the user this connection belongs to.  */
        getUser(): Promise<User.Document>;
    }

    export interface Document
        extends Types.Connection.Entity,
            Methods,
            Mongoose.Document {
        id: string;
    }

    export interface Model
        extends Mongoose.Model<Types.Connection.Entity, {}, Methods> {}

    export const Schema = new Mongoose.Schema<
        Types.Connection.Entity,
        Model,
        undefined,
        Methods
    >(
        {
            userId: { type: String, required: true, match: Validate.ObjectId },

            providerName: { type: String, required: true },
            accountId: { type: String, required: true, unique: true },
            accountUsername: { type: String, required: true },
            refreshToken: { type: String, required: false },

            linkedTimestamp: { type: Number, default: Date.now },
        },
        {
            toJSON: {
                transform(_, record) {
                    record.id = record._id;
                    delete record._id;
                    delete record.__v;
                    delete record.refreshToken;
                    return record;
                },
            },
        }
    );

    Schema.method('getUser', function getUser(this: Document) {
        return User.Model.findById(this.userId).exec();
    });

    export const Model = Mongoose.model<Types.Connection.Entity, Model>(
        'Connection',
        Schema
    );
}
