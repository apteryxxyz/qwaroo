/* eslint-disable @typescript-eslint/no-use-before-define */
import { URL } from 'node:url';
import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import {
    ModelOptions,
    Plugins,
    Pre,
    Prop,
    Ref,
    Severity,
    getModelForClass,
} from '@typegoose/typegoose';
import mongoose, { SchemaTypes } from 'mongoose';
import { User } from './User';
import { Slug } from '@/utilities/Slug';

@ModelOptions({
    options: { customName: 'Game', allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            transform(_, record) {
                record.id = record._id;
                delete record._id;
                delete record.__v;
                return record;
            },
        },
    },
})
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

    @Prop({
        minlength: 3,
        maxlength: 40,
        default(this: Game) {
            return Slug.createWithTransliteration(this.title);
        },
    })
    public slug!: string;

    @Prop({
        required: true,
        minlength: 3,
        maxlength: 40,
    })
    public title!: string;

    @Prop({
        ref: 'User',
        required: true,
        autopopulate: true,
    })
    public creator!: Ref<User>;

    @Prop({
        required: true,
        minlength: 8,
        maxlength: 64,
    })
    public shortDescription!: string;

    @Prop({
        required: true,
        minlength: 96,
        maxlength: 512,
    })
    public longDescription!: string;

    @Prop({ required: true })
    public thumbnailUrl!: string;

    @Prop({ type: () => [String], required: true })
    public categories!: string[];

    @Prop({ required: true, default: 0 })
    public flags!: number;

    @Prop({ type: () => ExtraData, required: true })
    public extraData!: ExtraData;

    @Prop({})
    public sourceSlug?: string;

    @Prop({ type: () => SchemaTypes.Mixed })
    public sourceProperties?: Record<string, unknown>;

    @Prop()
    public highScore?: number;

    @Prop()
    public highScoreTime?: number;

    @Prop()
    public highScoreTimestamp?: string;

    @Prop({ default: 0 })
    public totalScore!: number;

    @Prop({ default: 0 })
    public totalTime!: number;

    @Prop({ default: 0 })
    public totalPlays!: number;

    @Prop()
    public lastScore?: number;

    @Prop()
    public lastTime?: number;

    @Prop()
    public lastPlayedTimestamp?: number;

    @Prop({ default: Date.now })
    public createdTimestamp!: number;

    @Prop()
    public editedTimestamp?: number;

    @Prop()
    public updatedTimestamp?: number;

    public async getCreator(force = false) {
        if (!force && this.creator instanceof User.Model) return this.creator;
        return (this.creator = (await User.Model.findById(
            this.creator
        ).exec())!);
    }

    public static async getGameCategories() {
        const categories = await Game.Model.find({
            flags: { $bitsAllSet: Game.Flag.Public },
        })
            .distinct<string[]>('categories')
            .exec();
        return Array.from(new Set(categories.flat()));
    }

    public static async getGames() {
        return Game.Model.find({
            flags: { $bitsAllSet: Game.Flag.Public },
        });
    }

    public static async getGameBySlug(slug: string) {
        return Game.Model.findOne({
            slug,
            flags: { $bitsAllSet: Game.Flag.Public },
        });
    }
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
    };

    export type Document = DocumentType<Game>;

    export enum Flag {
        None = 0,
        Public = 1,
    }

    export interface Item {
        display: string;
        value: number;
        imageSource: string;
        imageFrame: 'fit' | 'fill';
        caption?: string;
    }
}
