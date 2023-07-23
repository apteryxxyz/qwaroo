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
import type { User } from './user';

@ModelOptions({
  options: { customName: 'Score' },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(document, record) {
        return {
          id: document._id?.toString(),
          ..._.omit(record, ['_id', '__v', 'tokenData']),
        } as Score.Entity;
      },
    },
  },
})
export class Score {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  /** The user this score object belongs to. */
  @Prop({ ref: 'User', required: true })
  public user!: Ref<User>;

  /** The game this score object is for. */
  @Prop({ ref: 'Game', required: true })
  public game!: Ref<Game>;

  /** The total score earned for this game. */
  @Prop({ default: 0 })
  public totalScore: number = 0;

  /** The total time spent playing this game. */
  @Prop({ default: 0 })
  public totalTime: number = 0;

  /** The total number of times this game has been played. */
  @Prop({ default: 0 })
  public totalPlays: number = 0;

  /** The highest score earned for this game by this user. */
  @Prop()
  public highScore?: number;

  /** The game time for the highest score. */
  @Prop()
  public highScoreTime?: number;

  /** Date of when the high score was achieved. */
  @Prop()
  public highScoreAt?: Date;

  /** The last score earned for this game. */
  @Prop()
  public lastScore?: number;

  /** The game time for the last score. */
  @Prop()
  public lastTime?: number;

  /** Date of when the last score was achieved. */
  @Prop()
  public lastPlayedAt?: Date;
}

export namespace Score {
  export const Model =
    (mongoose.models['Score'] as ReturnModelType<typeof Score>) ??
    getModelForClass(Score);

  export type Entity<TFields extends 'game' | 'user' | undefined = undefined> =
    {
      [K in keyof Score]: Score[K] extends Function ? never : Score[K];
    } & (TFields extends undefined
      ? {}
      : {
          [K in TFields & string]: K extends 'game'
            ? Game.Entity
            : K extends 'user'
            ? User.Entity
            : never;
        });

  export type Document = DocumentType<Score>;
}
