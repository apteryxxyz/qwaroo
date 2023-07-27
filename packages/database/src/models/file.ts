import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import {
  getModelForClass,
  ModelOptions,
  Prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import _ from 'lodash';
import mongoose from 'mongoose';
import type { User } from './user';

@ModelOptions({
  options: { customName: 'File', allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(document, record) {
        return {
          id: document._id?.toString(),
          ..._.omit(record, ['_id', '__v', 'tokenData']),
        } as File.Entity;
      },
    },
  },
})
export class File {
  public _id!: mongoose.Types.ObjectId;
  public id!: string;
  public createdAt!: Date;
  public updatedAt?: Date;

  /** The user that uploaded this file. */
  @Prop({ ref: 'User', required: true })
  public uploader!: Ref<User>;

  /** A hash generated from the file buffer, signals the location of the file. */
  @Prop({ required: true })
  public hash!: string;

  /** The content/mime type of the file, not used but nice to have. */
  @Prop({ required: true })
  public type!: string;

  /** The length of the file in bytes. */
  @Prop({ required: true })
  public length!: number;

  /** Any metadata associated with the file. */
  @Prop({ type: Object })
  public metadata!: Record<string, unknown>;
}

export namespace File {
  export const Model =
    (mongoose.models['File'] as ReturnModelType<typeof File>) ??
    getModelForClass(File);

  // export type Entity = {
  //   [K in keyof File]: File[K] extends Function ? never : File[K];
  // };

  export type Entity<TFields extends 'uploader' | undefined = undefined> = {
    [K in keyof File]: File[K] extends Function ? never : File[K];
  } & (TFields extends undefined
    ? {}
    : { [K in TFields & string]: K extends 'uploader' ? User.Entity : never });

  export type Document = DocumentType<File>;
}
