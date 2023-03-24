import type { AnyComponentBuilder } from '@discordjs/builders';
import { ActionRowBuilder } from '@discordjs/builders';

export function buildComponentRow<T extends AnyComponentBuilder>(
    ...components: T[]
) {
    return new ActionRowBuilder<T>().setComponents(...components);
}
