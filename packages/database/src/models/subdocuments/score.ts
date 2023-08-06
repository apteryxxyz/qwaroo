import { Prop } from '@typegoose/typegoose';

export class Score {
  /** The total score earned. */
  @Prop({ default: 0 })
  public totalScore: number = 0;

  /** The total time spent playing. */
  @Prop({ default: 0 })
  public totalTime: number = 0;

  /** The total number of times this has been played. */
  @Prop({ default: 0 })
  public totalPlays: number = 0;

  /** The highest score earned. */
  @Prop()
  public highScore?: number;

  /** The time for the highest score. */
  @Prop()
  public highScoreTime?: number;

  /** Date of when the high score was achieved. */
  @Prop()
  public highScoreAt?: Date;

  /** The last score earned. */
  @Prop()
  public lastScore?: number;

  /** The time for the last score. */
  @Prop()
  public lastTime?: number;

  /** Date of when the last score was achieved. */
  @Prop()
  public lastPlayedAt?: Date;
}

export namespace Score {
  export type Entity<TFields extends undefined = undefined> = {
    [K in keyof Score]: Score[K] extends Function ? never : Score[K];
  } & (TFields extends undefined ? {} : {});
}
