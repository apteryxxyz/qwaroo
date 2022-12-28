import { Game } from '@qwaroo/types';
import { BitField } from './BitField';

export class GameFlagsBitField extends BitField<typeof Game.Flags>(
    Game.Flags
) {}
