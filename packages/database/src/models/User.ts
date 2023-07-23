import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { getModelForClass, ModelOptions, Prop } from '@typegoose/typegoose';
import _ from 'lodash';
import mongoose from 'mongoose';

@ModelOptions({
  options: { customName: 'User' },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(document, record) {
        return {
          id: document._id?.toString(),
          ..._.omit(record, ['_id', '__v', 'emailAddress', 'emailVerifiedAt']),
        } as User.Entity;
      },
    },
  },
})
export class User {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  /** The users email address. */
  @Prop({ required: true, unique: true })
  public emailAddress!: string;

  /** The timestamp when the users email address was verified. */
  @Prop()
  public emailVerifiedAt?: Date;

  /** A display name, does not need to be unique. */
  @Prop({ required: true })
  public displayName!: string;

  /** A URL to the users avatar if it exists. */
  @Prop()
  public avatarUrl?: string;
}

export namespace User {
  export const Model =
    (mongoose.models['User'] as ReturnModelType<typeof User>) ??
    getModelForClass(User);

  export type Entity = {
    [K in keyof Omit<
      User,
      'emailAddress' | 'emailVerifiedAt'
    >]: User[K] extends Function ? never : User[K];
  };

  export type Document = DocumentType<User>;
}
