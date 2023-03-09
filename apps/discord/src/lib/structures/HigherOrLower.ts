import process from 'node:process';
import { URL } from 'node:url';
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import type { Game, User } from '@qwaroo/server';
import { Scores, getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import type { User as DiscordUser, Message } from 'discord.js';
import { ButtonStyle } from 'discord.js';
import { Base } from 'maclary';
import { ItemListing } from './ItemListing';

export class HigherOrLower extends Base {
    public readonly game: Game.Document;
    public readonly player: User.Document;
    public readonly user: DiscordUser;
    public readonly message: Message;

    public items?: ItemListing<Game.Item<(typeof Game.Mode)['HigherOrLower']>>;

    public startTime?: number;
    public endTime?: number;
    public inactiveTimer?: NodeJS.Timeout;

    public highScore = 0;
    public displayScore = 0;
    public internalScore = 0;
    public status: HigherOrLower.Status = HigherOrLower.Status.Preparing;
    public steps: Game.Step<(typeof Game.Mode)['HigherOrLower']>[] = [];

    public constructor(
        game: Game.Document,
        player: User.Document,
        user: DiscordUser,
        message: Message
    ) {
        super();
        this.game = game;
        this.player = player;
        this.user = user;
        this.message = message;
    }

    public get id() {
        return `${this.game.id}-${this.player.id}-${process.pid}`;
    }

    public resetTimer() {
        if (this.inactiveTimer) clearTimeout(this.inactiveTimer);
        this.inactiveTimer = setTimeout(() => this.end(), 1_000 * 60 * 5);
    }

    public async prepare() {
        this.steps = [];
        this.items = new ItemListing(this.game);
        await this.items.fetchMore();
        this.status = HigherOrLower.Status.Waiting;
    }

    public async start() {
        this.startTime = Date.now();
        await this.message.edit(this.buildDisplay());
    }

    public async end() {
        this.endTime = Date.now();
        this.status = HigherOrLower.Status.Finished;

        await Scores.submitScore(this.player, this.game, {
            seed: String(this.items?.seed),
            version: String(this.items?.version),
            time: this.endTime! - this.startTime!,
            steps: this.steps!,
        });

        await this.message.edit(this.buildGameOver());
    }

    public async pick(
        decision: Game.Step<(typeof Game.Mode)['HigherOrLower']>
    ) {
        this.status = HigherOrLower.Status.Picking;

        const previousItem = this.relativeAt(-1)!;
        const currentItem = this.relativeAt(0)!;

        if (
            (previousItem.value > currentItem.value && decision === 1) ||
            (previousItem.value < currentItem.value && decision === -1)
        )
            return this.end();

        this.steps.push(decision);
        const newScore = this.internalScore + 1;
        const currentLength = this.items!.length;
        const totalLength = this.items!.total!;

        this.displayScore = newScore;
        if (newScore > this.highScore) this.highScore = newScore;
        await this.message.edit(this.buildDisplay());

        await new Promise(resolve => setTimeout(resolve, 1_000));
        this.internalScore = newScore;

        if (newScore >= totalLength - 1) return this.end();
        if (currentLength - newScore < 3) await this.items!.fetchMore();

        this.status = HigherOrLower.Status.Waiting;
        await this.message.edit(this.buildDisplay());
    }

    public relativeAt(index: -1 | 0 | 1) {
        return this.items!.at(this.internalScore + index + 1);
    }

    public buildDisplay() {
        const gameUrl = new URL(
            WebRoutes.game(this.game.slug),
            getEnv(String, 'WEB_URL')
        ).toString();

        const previousItem = this.relativeAt(-1)!;
        const currentItem = this.relativeAt(0)!;

        const mainEmbed = new EmbedBuilder()
            .setTitle(this.game.title)
            .setURL(gameUrl)
            .setDescription(
                `Score: **${this.displayScore}**\nHigh Score: **${this.highScore}**`
            )
            .addFields(
                {
                    name: previousItem.display,
                    value: `${this.game.extraData.valueVerb} **${previousItem.value}** ${this.game.extraData.valueNoun}`,
                    inline: true,
                },
                {
                    name: currentItem.display,
                    value:
                        this.status === HigherOrLower.Status.Picking
                            ? `${this.game.extraData.valueVerb} **${currentItem.value}** ${this.game.extraData.valueNoun}`
                            : this.game.extraData.valueVerb,
                    inline: true,
                }
            )
            .setColor(0x3884f8);

        const leftImage = new EmbedBuilder()
            .setURL(gameUrl)
            .setImage(previousItem.imageSource);
        const rightImage = new EmbedBuilder()
            .setURL(gameUrl)
            .setImage(currentItem.imageSource);

        const buttonRow = new ActionRowBuilder<ButtonBuilder>();
        buttonRow.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`play,${this.id},pick,higher`)
                .setLabel(this._addPadding(this.game.extraData.higherText, 14))
                .setDisabled(this.status !== HigherOrLower.Status.Waiting),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`play,${this.id},end`)
                .setLabel('Give Up')
                .setDisabled(this.status !== HigherOrLower.Status.Waiting),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`play,${this.id},pick,lower`)
                .setLabel(this._addPadding(this.game.extraData.lowerText, 14))
                .setDisabled(this.status !== HigherOrLower.Status.Waiting)
        );

        return {
            content: this.user.toString(),
            embeds: [mainEmbed, leftImage, rightImage],
            components: [buttonRow],
        };
    }

    public buildGameOver() {
        const gameUrl = new URL(
            WebRoutes.game(this.game.slug),
            getEnv(String, 'WEB_URL')
        ).toString();

        const mainEmbed = new EmbedBuilder()
            .setTitle(this.game.title)
            .setURL(gameUrl)
            .setDescription(
                `**Game Over**\nYou scored **${this.internalScore}** points!`
            )
            .setThumbnail(this.game.thumbnailUrl)
            .setColor(0x3884f8);

        const buttonRow = new ActionRowBuilder<ButtonBuilder>();
        buttonRow.addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`game,${this.game.id},play`)
                .setLabel('Play Again')
        );

        return { embeds: [mainEmbed], components: [buttonRow] };
    }

    private _addPadding(str: string, length: number) {
        const side = Math.round((length - str.length) / 2);
        return 'ㅤ'.repeat(side) + str + 'ㅤ'.repeat(side);
    }
}

export namespace HigherOrLower {
    export enum Status {
        Preparing = 'preparing',
        Waiting = 'waiting',
        Picking = 'picking',
        Finished = 'finished',
    }
}
