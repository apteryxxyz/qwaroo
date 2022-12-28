import { User } from '@qwaroo/types';
import { BitField } from './BitField';

export class UserFlagsBitField extends BitField<typeof User.Flags>(
    User.Flags
) {}
