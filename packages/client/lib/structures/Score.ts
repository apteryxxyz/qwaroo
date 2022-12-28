import type { APIScore, Score as ScoreEntity } from '@qwaroo/types';
import { Base } from './Base';
import type { ScoreManager } from '#/managers/ScoreManager';

/** A game score. */
export class Score<H extends boolean = boolean>
    extends Base
    implements APIScore
{
    /** The manager of the score. */
    public scores: ScoreManager;

    public userId!: string;
    public gameId!: string;

    public highScore!: H extends true ? number : undefined;
    public highScoreTime!: H extends true ? number : undefined;
    public highScoreTimestamp!: H extends true ? number : undefined;

    public totalScore!: number;
    public totalTime!: number;
    public totalPlays!: number;

    public firstPlayedTimestamp!: number;
    public lastPlayedTimestamp!: number;

    public constructor(scores: ScoreManager, data: APIScore) {
        super(scores.client, data);
        this.scores = scores;
        this._patch(data);
    }

    public override _patch(data: APIScore) {
        this.userId = data.userId;
        this.gameId = data.gameId;

        type T = H extends true ? number : undefined;
        this.highScore = data.highScore as T;
        this.highScoreTime = data.highScoreTime as T;
        this.highScoreTimestamp = data.highScoreTimestamp as T;

        this.totalScore = data.totalScore;
        this.totalTime = data.totalTime;
        this.totalPlays = data.totalPlays;

        this.firstPlayedTimestamp = data.firstPlayedTimestamp;
        this.lastPlayedTimestamp = data.lastPlayedTimestamp;

        return super._patch(data);
    }

    /** Check if the score has been fetched. */
    public get partial() {
        return this.userId === undefined;
    }

    /** The date the high score was achieved. */
    public get highScoreAt() {
        return this.highScoreTimestamp
            ? new Date(this.highScoreTimestamp)
            : undefined;
    }

    /** The date of the first play. */
    public get firstPlayedAt() {
        return new Date(this.firstPlayedTimestamp);
    }

    /** The date of the last play. */
    public get lastPlayedAt() {
        return new Date(this.lastPlayedTimestamp);
    }

    public override equals(other: Score | APIScore) {
        return (
            this.id === other.id &&
            this.userId === other.userId &&
            this.gameId === other.gameId &&
            this.highScore === other.highScore &&
            this.highScoreTime === other.highScoreTime &&
            this.highScoreTimestamp === other.highScoreTimestamp &&
            this.totalScore === other.totalScore &&
            this.totalTime === other.totalTime &&
            this.totalPlays === other.totalPlays &&
            this.firstPlayedTimestamp === other.firstPlayedTimestamp &&
            this.lastPlayedTimestamp === other.lastPlayedTimestamp
        );
    }

    /** Fetch the score. */
    public fetch(force = true) {
        return this.scores.fetchOne(this.id, force);
    }

    /** Fetch this scores user. */
    public fetchUser(force = true) {
        return this.scores.user.fetch(force);
    }

    /** Fetch this scores game. */
    public fetchGame(force = true) {
        return this.client.games.fetchOne(this.gameId, force);
    }

    public override toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            gameId: this.gameId,
            highScore: this.highScore,
            highScoreTime: this.highScoreTime,
            highScoreTimestamp: this.highScoreTimestamp,
            totalScore: this.totalScore,
            totalTime: this.totalTime,
            totalPlays: this.totalPlays,
            firstPlayedTimestamp: this.firstPlayedTimestamp,
            lastPlayedTimestamp: this.lastPlayedTimestamp,
        };
    }

    public static isResolvable(value: unknown): value is Score.Resolvable {
        return (
            typeof value === 'string' ||
            value instanceof Score ||
            Reflect.has(value ?? {}, 'id')
        );
    }

    public static resolveId(value: unknown) {
        if (Score.isResolvable(value))
            return typeof value === 'string' ? value : value.id;
        return null;
    }
}

export namespace Score {
    export type Entity<H extends boolean = boolean> = ScoreEntity<H>;
    export type Resolvable = Score | Entity | string;
}
