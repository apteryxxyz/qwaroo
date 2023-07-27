import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import {
  getModelForClass,
  ModelOptions,
  Prop,
  Ref,
} from '@typegoose/typegoose';
import _ from 'lodash';
import mongoose from 'mongoose';
import type { Game } from './game';
import { Reaction } from './subdocuments/reaction';
import { Score } from './subdocuments/score';
import type { User } from './user';

@ModelOptions({
  options: { customName: 'Activity' },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(document, record) {
        return {
          id: document._id?.toString(),
          ..._.omit(record, ['_id', '__v', 'tokenData']),
        } as Activity.Entity;
      },
    },
  },
})
export class Activity {
  public _id!: mongoose.Types.ObjectId;
  public id!: string;
  public createdAt!: Date;
  public updatedAt?: Date;

  /** The user this Activity object belongs to. */
  @Prop({ ref: 'User', required: true })
  public user!: Ref<User>;

  /** The game this Activity object is for. */
  @Prop({ ref: 'Game', required: true })
  public game!: Ref<Game>;

  /** The subdocument storing score data. */
  @Prop({ type: Score, default: () => ({}), _id: false })
  public score!: Score;

  /** The subdocument storing reaction data. */
  @Prop({ type: Reaction, default: () => ({}), _id: false })
  public reaction!: Reaction;
}

export namespace Activity {
  export const Model =
    (mongoose.models['Activity'] as ReturnModelType<typeof Activity>) ??
    getModelForClass(Activity);

  export type Entity<TFields extends 'game' | 'user' | undefined = undefined> =
    {
      [K in keyof Activity]: Activity[K] extends Function ? never : Activity[K];
    } & {
      score: Score.Entity;
    } & (TFields extends undefined
        ? {}
        : {
            [K in TFields & string]: K extends 'game'
              ? Game.Entity
              : K extends 'user'
              ? User.Entity
              : never;
          });

  export type Document = DocumentType<Activity>;
}
