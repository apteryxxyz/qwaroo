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
import type { User } from './User';
import { Slug } from '@/utilities/Slug';

@ModelOptions({
    options: { customName: 'Game', allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            transform(_, record) {
                record.id = record._id.toString();
                delete record._id;
                delete record.__v;
                record.extraData.id = record.extraData._id.toString();
                delete record.extraData._id;
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
@Pre('validate', async function validate(this: Game) {
    const url = new URL('https://wsrv.nl');
    url.searchParams.set('url', this.thumbnailUrl);
    const response = await fetch(url, { method: 'HEAD' });
    if (response.status !== 200)
        this.thumbnailUrl = 'https://wsrv.nl/lichtenstein.jpg';
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
    })
    public thumbnailUrl!: string;

    /** Category assigned to this game. */
    @Prop({ required: true })
    public category!: string;

    /** Extra data for this game. */
    @Prop({ type: () => ExtraData, required: true })
    public extraData!: ExtraData;

    /** Source slug for automatic game items updating. */
    @Prop({})
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

class ExtraData {
    @Prop({ required: true })
    public valueVerb!: string;

    @Prop({ required: true })
    public valueNoun!: string;

    @Prop({ required: true })
    public higherText!: string;

    @Prop({ required: true })
    public lowerText!: string;

    @Prop()
    public valuePrefix?: string;

    @Prop()
    public valueSuffix?: string;
}

export namespace Game {
    export const Model =
        (mongoose.models['Game'] as ReturnModelType<typeof Game>) ??
        getModelForClass(Game);

    export type Entity = {
        [K in keyof Game]: Game[K] extends Function ? never : Game[K];
    } & { creator: User.Entity };

    export type Document = DocumentType<Game>;
}
