import type { Score as ScoreEntity } from '@qwaroo/types';
import { Base } from './Base';
import type { ScoreManager } from '#/managers/ScoreManager';

/** A game score. */
export class Score<H extends boolean = boolean>
    extends Base
    implements Score.Entity<H>
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

    public constructor(
        scores: ScoreManager,
        data: Partial<ScoreEntity> & { id: string }
    ) {
        super(scores.client, data);
        this.scores = scores;
        this._patch(data);
    }

    public override _patch(data: Partial<ScoreEntity> & { id: string }) {
        if (data.id) this.id = data.id;
        if (data.userId) this.userId = data.userId;
        if (data.gameId) this.gameId = data.gameId;

        if (data.highScore)
            this.highScore = data.highScore as H extends true
                ? number
                : undefined;
        if (data.highScoreTime)
            this.highScoreTime = data.highScoreTime as H extends true
                ? number
                : undefined;
        if (data.highScoreTimestamp)
            this.highScoreTimestamp = data.highScoreTimestamp as H extends true
                ? number
                : undefined;

        if (data.totalScore) this.totalScore = data.totalScore;
        if (data.totalTime) this.totalTime = data.totalTime;
        if (data.totalPlays) this.totalPlays = data.totalPlays;
        if (data.firstPlayedTimestamp)
            this.firstPlayedTimestamp = data.firstPlayedTimestamp;
        if (data.lastPlayedTimestamp)
            this.lastPlayedTimestamp = data.lastPlayedTimestamp;

        return data;
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

    public override equals(other: Score | Score.Entity) {
        return (
            other.id === this.id &&
            other.userId === this.userId &&
            other.gameId === this.gameId &&
            other.highScore === this.highScore &&
            other.highScoreTime === this.highScoreTime &&
            other.highScoreTimestamp === this.highScoreTimestamp &&
            other.totalScore === this.totalScore &&
            other.totalTime === this.totalTime &&
            other.totalPlays === this.totalPlays &&
            other.firstPlayedTimestamp === this.firstPlayedTimestamp &&
            other.lastPlayedTimestamp === this.lastPlayedTimestamp
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
