/* eslint-disable @typescript-eslint/no-use-before-define */
import { URL } from 'node:url';
import {
    Index,
    ModelOptions,
    Plugins,
    Pre,
    Prop,
    Ref,
    Severity,
    getModelForClass,
} from '@typegoose/typegoose';
import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import mongoose, { SchemaTypes } from 'mongoose';
import { z } from 'zod';
import type { User } from './User';
import { Slug } from '@/utilities/Slug';

@ModelOptions({
    options: { customName: 'Game', allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            transform(_, record) {
                record.id ??= record._id?.toString();
                delete record._id;
                delete record.__v;
                return record;
            },
        },
    },
})
@Index(
    {
        title: 'text',
        shortDescription: 'text',
        longDescription: 'text',
        category: 'text',
    },
    {
        weights: {
            title: 10,
            shortDescription: 5,
            longDescription: 1,
            category: 5,
        },
    }
)
@Pre('validate', async function validate(this: Game.Document) {
    if (!this.isModified('thumbnailUrl')) return;

    try {
        const url = new URL(this.thumbnailUrl);
        const safeHosts = ['i.imgur.com', 'wsrv.nl'];
        if (!safeHosts.includes(url.host)) {
            const test = new URL('https://wsrv.nl');
            test.searchParams.set('url', this.thumbnailUrl);
            const response = await fetch(test, { method: 'HEAD' });
            if (!response.ok) throw new Error('Invalid thumbnail URL');
        }
    } catch {
        this.thumbnailUrl = 'https://wsrv.nl/lichtenstein.jpg';
    }
})
@Pre('save', async function save(this: Game.Document) {
    if (this.isModified('title'))
        this.slug = Slug.createWithTransliteration(this.title);
    this.editedAt = new Date();
})
@Plugins(require('mongoose-autopopulate'))
export class Game {
    public id!: string;

    /** Title of this game. */
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 40,
    })
    public title!: string;

    /** Slug of this games title, must be unique. */
    @Prop({
        unique: true,
        minlength: 3,
        maxlength: 40,
        default(this: Game) {
            return Slug.createWithTransliteration(this.title);
        },
    })
    public slug!: string;

    /** The user that created this game. */
    @Prop({
        ref: 'User',
        required: true,
        autopopulate: true,
    })
    public creator!: Ref<User>;

    /** A short description for this game, shown to users on display card. */
    @Prop({
        required: true,
        minlength: 8,
        maxlength: 64,
    })
    public shortDescription!: string;

    /** A longer description for this game, shown to users on game page. */
    @Prop({
        required: true,
        minlength: 96,
        maxlength: 512,
    })
    public longDescription!: string;

    /** The URL to the thumbnail image for this game. */
    @Prop({
        required: true,
        validate: {
            validator(value: string) {
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            },
            message: 'Invalid thumbnail URL',
        },
        maxlength: 512,
    })
    public thumbnailUrl!: string;

    /** Category assigned to this game. */
    @Prop({ required: true, minlength: 3, maxlength: 40 })
    public category!: string;

    @Prop({ required: true, maxlength: 40 })
    public valueVerb!: string;

    @Prop({ required: true, maxlength: 40 })
    public valueNoun!: string;

    @Prop({ required: true, maxlength: 40 })
    public higherText!: string;

    @Prop({ required: true, maxlength: 40 })
    public lowerText!: string;

    @Prop({ maxlength: 10 })
    public valuePrefix?: string;

    @Prop({ maxlength: 10 })
    public valueSuffix?: string;

    /** Source slug for automatic game items updating. */
    @Prop({ maxlength: 40 })
    public sourceSlug?: string;

    /** Source properties for automatic game items updating. */
    @Prop({ type: () => SchemaTypes.Mixed })
    public sourceProperties?: Record<string, unknown>;

    /** The total score earned for this game. */
    @Prop({ default: 0 })
    public totalScore: number = 0;

    /** The total time spent playing this game. */
    @Prop({ default: 0 })
    public totalTime: number = 0;

    /** The total number of times this game has been played. */
    @Prop({ default: 0 })
    public totalPlays: number = 0;

    /** The highest score earned for this game. */
    @Prop()
    public highScore?: number;

    /** The game time for the highest score. */
    @Prop()
    public highScoreTime?: number;

    /** Date of when the high score was achieved. */
    @Prop()
    public highScoreAt?: Date;

    /** The last score earned for this game. */
    @Prop()
    public lastScore?: number;

    /** The game time for the last score. */
    @Prop()
    public lastTime?: number;

    /** Date of when the last score was achieved. */
    @Prop()
    public lastPlayedAt?: Date;

    /** Date of when this game was created. */
    @Prop({ default: Date.now })
    public createdAt!: Date;

    /** Date of when this game was last edited. */
    @Prop()
    public editedAt?: Date;

    /** Date of when this games items were last updated. */
    @Prop()
    public updatedAt?: Date;
}

export namespace Game {
    export const Model =
        (mongoose.models['Game'] as ReturnModelType<typeof Game>) ??
        getModelForClass(Game);

    export type Entity = {
        [K in keyof Game]: Game[K] extends Function ? never : Game[K];
    } & { creator: User.Entity };

    export type Document = DocumentType<Game>;

    /** Zod schema for properties that can be user defined. */
    export const Schema = z.object({
        title: z.string().min(3).max(40),
        shortDescription: z.string().min(8).max(64),
        longDescription: z.string().min(96).max(512),
        thumbnailUrl: z.string().url().max(512),
        category: z.string().min(3).max(40),
        valueVerb: z.string().max(40),
        valueNoun: z.string().max(40),
        higherText: z.string().max(40),
        lowerText: z.string().max(40),
        valuePrefix: z.string().max(10),
        valueSuffix: z.string().max(10),
        sourceSlug: z.string().max(40),
        sourceProperties: z.record(z.unknown()),
    });
}
