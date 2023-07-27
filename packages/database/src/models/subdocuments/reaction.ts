import { Prop } from '@typegoose/typegoose';

export class Reaction {
  /** The rating direction, -1 is disliked, 1 is liked. */
  @Prop({
    default: 0,
    validate: (v: unknown) => v === -1 || v === 0 || v === 1,
  })
  public rating: -1 | 0 | 1 = 0;

  /** Whether or not this has been favourited. */
  @Prop({ default: false })
  public favourited: boolean = false;
}

export namespace Reaction {
  export type Entity<TFields extends undefined = undefined> = {
    [K in keyof Reaction]: Reaction[K] extends Function ? never : Reaction[K];
  } & (TFields extends undefined ? {} : {});
}
