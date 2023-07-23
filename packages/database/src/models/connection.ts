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
  options: { customName: 'Connection', allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(document, record) {
        return {
          id: document._id?.toString(),
          ..._.omit(record, ['_id', '__v', 'tokenData']),
        } as Connection.Entity;
      },
    },
  },
})
export class Connection {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  /** The user this connection belongs to. */
  @Prop({ ref: 'User', required: true })
  public user!: Ref<User>;

  /** The ID of the provider this connection is for. */
  @Prop({ required: true })
  public providerId!: string;

  /** The type of this connections provider. */
  @Prop({ required: true })
  public providerType!: 'credentials' | 'email' | 'oauth' | 'oidc';

  /** This connections identifier within the provider. */
  @Prop({ required: true })
  public accountId!: string;

  /** Token data provided by */
  @Prop({ type: Object })
  public tokenData!: Record<string, unknown>;
}

export namespace Connection {
  export const Model =
    (mongoose.models['Connection'] as ReturnModelType<typeof Connection>) ??
    getModelForClass(Connection);

  export type Entity<TFields extends 'user' | undefined = undefined> = {
    [K in keyof Omit<Connection, 'tokenData'>]: Connection[K] extends Function
      ? never
      : Connection[K];
  } & (TFields extends undefined
    ? {}
    : { [K in TFields & string]: K extends 'user' ? User.Entity : never });

  export type Document = DocumentType<Connection>;
}
