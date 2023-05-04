import type { Game } from '#/entities/Game';

export interface APISource {
    mode: Game.Mode;
    slug: string;
    name: string;
    description: string;
    iconUrl: string;

    properties: APIProperty[];
}

export type APIPropertyType = 'string' | 'number' | 'boolean';

export interface APIProperty {
    key: string;
    type: APIPropertyType | [APIPropertyType];

    name: string;
    description: string;

    required?: boolean;
    default?: unknown;
    options?: { label: string; value: unknown }[];
    validate?: string;
}
