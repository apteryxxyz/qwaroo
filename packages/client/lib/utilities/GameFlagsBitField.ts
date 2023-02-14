import * as Types from '@qwaroo/types';
import { BitField } from './BitField';

export class GameFlagsBitField extends BitField<typeof Types.Game.Flags>(
    Types.Game.Flags
) {
    public get [Symbol.toStringTag]() {
        return 'GameFlagsBitField';
    }
}
