import * as Types from '@qwaroo/types';
import { BitField } from './BitField';

export class UserFlagsBitField extends BitField<typeof Types.User.Flags>(
    Types.User.Flags
) {
    public get [Symbol.toStringTag]() {
        return 'UserFlagsBitField';
    }
}
