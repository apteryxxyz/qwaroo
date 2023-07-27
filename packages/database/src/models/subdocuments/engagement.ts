import { Prop } from '@typegoose/typegoose';

export class Engagement {
  /** The total number of likes this has had. */
  @Prop({ default: 0 })
  public likeCount: number = 0;

  /** The total number of dislikes this has had. */
  @Prop({ default: 0 })
  public dislikeCount: number = 0;

  /** The total number of favourites this has had. */
  @Prop({ default: 0 })
  public favouriteCount: number = 0;
}

export namespace Engagement {
  export type Entity<TFields extends undefined = undefined> = {
    [K in keyof Engagement]: Engagement[K] extends Function
      ? never
      : Engagement[K];
  } & (TFields extends undefined ? {} : {});
}
