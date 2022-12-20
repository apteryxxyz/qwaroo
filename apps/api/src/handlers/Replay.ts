import { ServerError as Error } from '@owenii/common';
import type { GameDocument } from '@owenii/database';
import type { APISubmitScore } from '@owenii/types';
import { Game as GameEntity } from '@owenii/types';
import { Games } from './Games';

export class Replay extends null {
    public static async replayGame(
        game: GameDocument,
        save: APISubmitScore<GameEntity.Mode>
    ) {
        let score = Number.NaN;
        let time = Number.NaN;

        if (game.mode === GameEntity.Mode.HigherOrLower) {
            const isValid = await Replay._isValidHigherOrLowerSave(game, save);
            if (!isValid) throw new Error(422, 'Invalid save data');

            score = save.steps.length - 1;
            time = save.time;
        } else {
            throw new Error(422, 'Invalid game type');
        }

        if (Number.isNaN(score) || Number.isNaN(time))
            throw new Error(422, 'Invalid save data');

        return { score, time } as const;
    }

    private static async _isValidHigherOrLowerSave(
        game: GameDocument,
        save: APISubmitScore<GameEntity.Mode.HigherOrLower>
    ) {
        if (game.mode !== GameEntity.Mode.HigherOrLower)
            throw new Error(422, 'Invalid game type');

        const [, items] = await Games.getGameItems(
            game,
            save.seed,
            save.steps.length + 2
        );

        for (const [i, decision] of save.steps.entries()) {
            const previousItem = items[i];
            const currentItem = items[i + 1];

            if (
                i === save.steps.length - 1 ||
                (decision === 1 && previousItem.value <= currentItem.value) ||
                (decision === -1 && previousItem.value >= currentItem.value)
            )
                continue;

            return false;
        }

        return true;
    }
}

// [100, 50, 25, 100, 50, 60]
// [-1, -1, 1, -1, 1]
