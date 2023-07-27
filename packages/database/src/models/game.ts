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
import { Engagement } from './subdocuments/engagement';
import { Score } from './subdocuments/score';
import type { User } from './user';

@ModelOptions({
  options: { customName: 'Game', allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(document, record) {
        document;

        return {
          ..._.omit(record, ['_id', '__v', 'tokenData']),
          id: document._id?.toString(),
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
  public _id!: mongoose.Types.ObjectId;
  public id!: string;
  public createdAt!: Date;
  public updatedAt?: Date;

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

  /** The subdocument storing score data. */
  @Prop({ type: Score, default: () => ({}), _id: false })
  public score!: Score;

  /** The subdocument storing engagement data. */
  @Prop({ type: Engagement, default: () => ({}), _id: false })
  public engagement!: Engagement;
}

export namespace Game {
  export const Model =
    (mongoose.models['Game'] as ReturnModelType<typeof Game>) ??
    getModelForClass(Game);

  export type Entity<TFields extends 'creator' | undefined = undefined> = {
    [K in keyof Game]: Game[K] extends Function ? never : Game[K];
  } & {
    score: Score.Entity;
  } & (TFields extends undefined
      ? {}
      : {
          [K in TFields & string]: K extends 'creator' ? User.Entity : never;
        });

  export type Document = DocumentType<Game>;
}
