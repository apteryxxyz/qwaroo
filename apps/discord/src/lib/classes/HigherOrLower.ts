import process from 'node:process';
import { URL } from 'node:url';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { Game, User } from '@qwaroo/server';
import { Scores, getEnv } from '@qwaroo/server';
import { WebRoutes } from '@qwaroo/types';
import { oneLine, stripIndent } from 'common-tags';
import type { User as DiscordUser, Message } from 'discord.js';
import { ButtonStyle } from 'discord.js';
import { ms } from 'enhanced-ms';
import { Base } from 'maclary';
import { ItemListing } from './ItemListing';
import * as Common from '#/builders/common';
import { getEmoji } from '#/utilities/emotes';

export class HigherOrLower extends Base {
    public readonly game: Game.Document;
    public readonly player: User.Document;
    public readonly user: DiscordUser;
    public readonly message: Message;

    public status = HigherOrLower.Status.Preparing;
    public answerStatus = HigherOrLower.AnswerStatus.Waiting;
    public items?: ItemListing<Game.Item<(typeof Game.Mode)['HigherOrLower']>>;

    public startTime?: number;
    public endTime?: number;
    public inactiveTimer?: NodeJS.Timeout;

    public highScore = 0;
    public displayScore = 0;
    public internalScore = 0;
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

        this.resetTimer();
    }

    public get id() {
        return `${this.game.id}-${this.player.id}-${process.pid}`;
    }

    public resetTimer() {
        if (this.inactiveTimer) clearTimeout(this.inactiveTimer);
        this.inactiveTimer = setTimeout(() => this.end(), 1_000 * 60 * 2);
    }

    public async prepare() {
        this.steps = [];
        this.items = new ItemListing(this.game);
        await this.items.fetchMore();
        this.status = HigherOrLower.Status.Waiting;
    }

    public async start() {
        this.startTime = Date.now();
        await this._updateMessage();
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

        const embed = this._buildGameOverEmbed();
        const buttons = Common.buildComponentRow(
            ...this._buildGameOverButtons()
        );

        await this.message.edit({
            embeds: [embed],
            components: [buttons],
        });
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
        ) {
            this.answerStatus = HigherOrLower.AnswerStatus.Wrong;
            await this._updateMessage();
            await new Promise(resolve => setTimeout(resolve, 1_000));
            return this.end();
        }

        this.steps.push(decision);
        this.answerStatus = HigherOrLower.AnswerStatus.Correct;
        const newScore = this.internalScore + 1;
        const currentLength = this.items!.length;
        const totalLength = this.items!.total!;

        this.displayScore = newScore;
        if (newScore > this.highScore) this.highScore = newScore;
        await this._updateMessage();

        await new Promise(resolve => setTimeout(resolve, 1_000));
        this.internalScore = newScore;

        if (newScore >= totalLength - 1) return this.end();
        if (currentLength - newScore < 3) await this.items!.fetchMore();

        this.answerStatus = HigherOrLower.AnswerStatus.Waiting;
        this.status = HigherOrLower.Status.Waiting;
        await this._updateMessage();
    }

    public relativeAt(index: -1 | 0 | 1) {
        return this.items!.at(this.internalScore + index + 1)!;
    }

    private _updateMessage() {
        const embed = this._buildDisplayEmbed();
        const buttons = Common.buildComponentRow(...this._buildActionButtons());

        return this.message.edit({
            content: this.user.toString(),
            embeds: [...embed],
            components: [buttons],
        });
    }

    private _buildDisplayEmbed() {
        const gameUrl = new URL(
            WebRoutes.game(this.game.slug),
            getEnv(String, 'WEB_URL')
        ).toString();
        const previousItem = this.relativeAt(-1)!;
        const currentItem = this.relativeAt(0)!;

        const scoreDisplay = stripIndent`
            Score: **${this.displayScore}**
            High Score: **${this.highScore}**
        `;

        const leftDisplay = this._buildItemDisplay(previousItem);
        const maxLength = `   ${this._buildItemDisplay(currentItem)}`.length;
        const rightDisplay = oneLine`
            ${
                this.answerStatus === HigherOrLower.AnswerStatus.Correct
                    ? getEmoji('check')
                    : ''
            }
            ${
                this.answerStatus === HigherOrLower.AnswerStatus.Wrong
                    ? getEmoji('cross')
                    : ''
            }            
            ${
                this.status === HigherOrLower.Status.Picking
                    ? this._buildItemDisplay(currentItem)
                    : '...'.padEnd(maxLength / 2 - 1, 'ㅤ')
            }
        `;

        const mainEmbed = new EmbedBuilder()
            .setTitle(this.game.title)
            .setURL(gameUrl)
            .setDescription(scoreDisplay)
            .setFields(
                {
                    name: previousItem.display,
                    value: leftDisplay,
                    inline: true,
                },
                {
                    name: currentItem.display,
                    value: rightDisplay,
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

        return [mainEmbed, leftImage, rightImage];
    }

    private _buildActionButtons() {
        return [
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`play,${this.id},pick,higher`)
                .setLabel(this.game.extraData.higherText)
                .setDisabled(this.status !== HigherOrLower.Status.Waiting),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`play,${this.id},end`)
                .setLabel('Give Up')
                .setDisabled(this.status !== HigherOrLower.Status.Waiting),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`play,${this.id},pick,lower`)
                .setLabel(this.game.extraData.lowerText)
                .setDisabled(this.status !== HigherOrLower.Status.Waiting),
        ];
    }

    private _buildItemDisplay(item: ReturnType<HigherOrLower['relativeAt']>) {
        return oneLine`
            ${this.game.extraData.valueVerb}
            **${item.value.toLocaleString('en-NZ')}**
            ${this.game.extraData.valueNoun}
        `;
    }

    private _buildGameOverEmbed() {
        return new EmbedBuilder()
            .setTitle(this.game.title)
            .setDescription(
                '**Game Over**\n' +
                    oneLine`
                You scored **${this.displayScore}** points in
                ${ms(this.endTime! - this.startTime!, { shortFormat: true })}!`
            )
            .setThumbnail(this.game.thumbnailUrl)
            .setColor(0x3884f8);
    }

    private _buildGameOverButtons() {
        const gameUrl = new URL(
            WebRoutes.game(this.game.slug),
            getEnv(String, 'WEB_URL')
        ).toString();

        return [
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(gameUrl)
                .setLabel('Play on Web'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`game,${this.game.id},play`)
                .setLabel('Play Again'),
        ];
    }
}

export namespace HigherOrLower {
    export enum Status {
        Preparing = 'preparing',
        Waiting = 'waiting',
        Picking = 'picking',
        Finished = 'finished',
    }

    export enum AnswerStatus {
        Waiting = 'waiting',
        Correct = 'correct',
        Wrong = 'wrong',
    }
}
