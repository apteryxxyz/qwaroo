import { ServerError as Error } from '@qwaroo/common';
import type { APISubmitScoreOptions } from '@qwaroo/types';
import { Items } from './Items';
import { Game } from '#/utilities/structures';

export class Replay extends null {
    public static async replayGame(
        game: Game.Document,
        save: APISubmitScoreOptions
    ) {
        let score = Number.NaN;
        let time = Number.NaN;

        if (game.mode === Game.Mode.HigherOrLower) {
            const xSave = save as APISubmitScoreOptions<number>;
            const isValid = await Replay._isValidHigherOrLowerSave(game, xSave);
            if (!isValid) throw new Error(422, 'Invalid save data');

            score = save.steps.length;
            time = save.time;
        } else {
            throw new Error(422, 'Invalid game type');
        }

        if (Number.isNaN(score) || Number.isNaN(time))
            throw new Error(422, 'Invalid save data');

        return { score, time } as const;
    }

    private static async _isValidHigherOrLowerSave(
        game: Game.Document,
        save: APISubmitScoreOptions<number>
    ) {
        const [, items] = await Items.getItems(game, {
            ...save,
            limit: save.steps.length + 1,
            skip: 0,
        });

        for (const [i, decision] of save.steps.entries()) {
            const previousItem = items[i] as { value: number };
            const currentItem = items[i + 1] as { value: number };

            if (
                (decision === 1 &&
                    previousItem['value'] <= currentItem['value']) ||
                (decision === -1 &&
                    previousItem['value'] >= currentItem['value'])
            )
                continue;

            return false;
        }

        return true;
    }
}
