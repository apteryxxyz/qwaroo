import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import {
  getModelForClass,
  Index,
  ModelOptions,
  Prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import _ from 'lodash';
import mongoose from 'mongoose';
import type { User } from './user';

@ModelOptions({
  options: { customName: 'Game', allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(document, record) {
        return {
          id: document._id?.toString(),
          ..._.omit(record, ['_id', '__v', 'tokenData']),
        } as Game.Entity;
      },
    },
  },
})
@Index(
  {
    title: 'text',
    shortDescription: 'text',
    longDescription: 'text',
    category: 'text',
  },
  {
    weights: {
      title: 10,
      shortDescription: 5,
      longDescription: 1,
      category: 5,
    },
  },
)
export class Game {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  /** Title of this game. */
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 40,
  })
  public title!: string;

  /** The user that created this game. */
  @Prop({ ref: 'User', required: true })
  public creator!: Ref<User>;

  /** A short description for this game, shown to users on display card. */
  @Prop({
    required: true,
    minlength: 8,
    maxlength: 64,
  })
  public shortDescription!: string;

  /** A longer description for this game, shown to users on game page. */
  @Prop({
    required: true,
    minlength: 96,
    maxlength: 512,
  })
  public longDescription!: string;

  /** The URL to the thumbnail image for this game. */
  @Prop({
    required: true,
    validate: {
      validator(value: string) {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid thumbnail URL',
    },
    maxlength: 512,
  })
  public thumbnailUrl!: string;

  /** Category assigned to this game. */
  @Prop({ required: true, minlength: 3, maxlength: 40 })
  public category!: string;

  @Prop({ required: true, maxlength: 40 })
  public valueVerb!: string;

  @Prop({ required: true, maxlength: 40 })
  public valueNoun!: string;

  @Prop({ maxlength: 40 })
  public higherText?: string;

  @Prop({ maxlength: 40 })
  public lowerText?: string;

  @Prop({ maxlength: 10 })
  public valuePrefix?: string;

  @Prop({ maxlength: 10 })
  public valueSuffix?: string;

  /** Source slug for automatic game items updating. */
  @Prop({ maxlength: 40 })
  public sourceSlug?: string;

  /** Source properties for automatic game items updating. */
  @Prop({ type: Object })
  public sourceProperties?: Record<string, unknown>;

  /** The total score earned for this game. */
  @Prop({ default: 0 })
  public totalScore: number = 0;

  /** The total time spent playing this game. */
  @Prop({ default: 0 })
  public totalTime: number = 0;

  /** The total number of times this game has been played. */
  @Prop({ default: 0 })
  public totalPlays: number = 0;

  /** The highest score earned for this game. */
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

export namespace Game {
  export const Model =
    (mongoose.models['Game'] as ReturnModelType<typeof Game>) ??
    getModelForClass(Game);

  export type Entity<TFields extends 'creator' | undefined = undefined> = {
    [K in keyof Game]: Game[K] extends Function ? never : Game[K];
  } & (TFields extends undefined
    ? {}
    : { [K in TFields & string]: K extends 'creator' ? User.Entity : never });

  export type Document = DocumentType<Game>;
}
