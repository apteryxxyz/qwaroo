import type * as Types from '@qwaroo/types';
import { Base } from './Base';
import type { Game } from './Game';
import type { User } from './User';
import type { ScoreManager } from '#/managers/ScoreManager';

/** A score. */
export class Score<P extends Game | User = Game | User> extends Base {
    public manager: ScoreManager<P>;

    /** The ID of the user that this score belongs to. */
    public userId!: string;
    /** The ID of the game that this score is for. */
    public gameId!: string;
    /** The highest score the user has gotten. */
    public highScore!: number;
    /** The time it took to get the highest score. */
    public highScoreTime!: number;
    /** The timestamp when the highest score was achieved. */
    public highScorePlayedTimestamp!: number;
    /** The total score. */
    public totalScore!: number;
    /** The total time. */
    public totalTime!: number;
    /** The total number of plays. */
    public totalPlays!: number;
    /** The score this user last scored. */
    public lastScore!: number;
    /** The time the last game took. */
    public lastTime!: number;
    /** The timestamp when this user last played this. */
    public lastPlayedTimestamp!: number;
    /** The timestamp when this user first played this. */
    public firstPlayedTimestamp!: number;

    public constructor(manager: ScoreManager<P>, data: Types.APIScore) {
        super(manager, data);
        this.manager = manager;
        this.patch(data);
    }

    public override patch(data: Types.APIScore) {
        this.userId = data.userId;
        this.gameId = data.gameId;
        this.highScore = data.highScore;
        this.highScoreTime = data.highScoreTime;
        this.highScorePlayedTimestamp = data.highScorePlayedTimestamp;
        this.totalScore = data.totalScore;
        this.totalTime = data.totalTime;
        this.totalPlays = data.totalPlays;
        this.lastScore = data.lastScore;
        this.lastTime = data.lastTime;
        this.lastPlayedTimestamp = data.lastPlayedTimestamp;
        this.firstPlayedTimestamp = data.firstPlayedTimestamp;

        return super.patch(data);
    }

    /** Check if the score has been fetched. */
    public get partial() {
        return this.userId === undefined;
    }

    /** The date the high score was achieved. */
    public get highScorePlayedAt() {
        return this.highScorePlayedTimestamp
            ? new Date(this.highScorePlayedTimestamp)
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

    /** Fetch this score. */
    public fetch() {
        return this.manager.fetchOne(this.id);
    }

    /** Fetch this scores user. */
    public fetchUser(force = false) {
        return this.client.users.fetchOne(this.userId, force);
    }

    /** Fetch this scores game. */
    public fetchGame(force = false) {
        return this.client.games.fetchOne(this.gameId, force);
    }

    public override equals(other: Score | Types.APIScore): boolean {
        return (
            super.equals(other) &&
            this.userId === other.userId &&
            this.gameId === other.gameId &&
            this.highScore === other.highScore &&
            this.highScoreTime === other.highScoreTime &&
            this.highScorePlayedTimestamp === other.highScorePlayedTimestamp &&
            this.totalScore === other.totalScore &&
            this.totalTime === other.totalTime &&
            this.totalPlays === other.totalPlays &&
            this.lastScore === other.lastScore &&
            this.lastTime === other.lastTime &&
            this.lastPlayedTimestamp === other.lastPlayedTimestamp &&
            this.firstPlayedTimestamp === other.firstPlayedTimestamp
        );
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
            userId: this.userId,
            gameId: this.gameId,
            highScore: this.highScore,
            highScoreTime: this.highScoreTime,
            highScorePlayedTimestamp: this.highScorePlayedTimestamp,
            totalScore: this.totalScore,
            totalTime: this.totalTime,
            totalPlays: this.totalPlays,
            lastScore: this.lastScore,
            lastTime: this.lastTime,
            lastPlayedTimestamp: this.lastPlayedTimestamp,
            firstPlayedTimestamp: this.firstPlayedTimestamp,
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

    public get [Symbol.toStringTag]() {
        return 'Score';
    }
}

export namespace Score {
    export type Resolvable = Score | Types.APIScore | Entity | string;
    export type Entity = Types.Score.Entity;
}
