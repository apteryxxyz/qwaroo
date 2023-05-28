import {
    ModelOptions,
    Plugins,
    Prop,
    Ref,
    getModelForClass,
} from '@typegoose/typegoose';
import type { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import type { Game } from './Game';
import type { User } from './User';

@ModelOptions({
    options: { customName: 'Score' },
    schemaOptions: {
        toJSON: {
            transform(_, record) {
                record.id = record._id.toString();
                delete record._id;
                delete record.__v;
                return record;
            },
        },
    },
})
@Plugins(require('mongoose-autopopulate'))
export class Score {
    public id!: string;

    @Prop({ ref: 'User', required: true, autopopulate: true })
    public user!: Ref<User>;

    @Prop({ ref: 'Game', required: true, autopopulate: true })
    public game!: Ref<Game>;

    @Prop()
    public highScore?: number;

    @Prop()
    public highScoreTime?: number;

    @Prop()
    public highScorePlayedTimestamp?: number;

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
}

export namespace Score {
    export const Model =
        (mongoose.models['Score'] as ReturnModelType<typeof Score>) ??
        getModelForClass(Score);

    export type Entity = {
        [K in keyof Score]: Score[K] extends Function ? never : Score[K];
    } & { user: User.Entity; game: Game.Entity };

    export type Document = DocumentType<Score>;

    export enum Provider {
        Discord = 'discord',
    }
}
