import * as Database from '@qwaroo/database';
import * as Types from '@qwaroo/types';

export namespace Connection {
    export type Entity = Types.Connection.Entity;
    export type ProviderName = Types.Connection.ProviderName;

    export type Methods = Database.Connection.Methods;
    export type Document = Database.Connection.Document;
    export type Model = Database.Connection.Model;
    export const Schema = Database.Connection.Schema;
    export const Model = Database.Connection.Model;
}

export namespace Game {
    export type Entity<M extends Mode = Mode> = Types.Game.Entity<M>;
    export type Mode = Types.Game.Mode;
    export const Mode = Types.Game.Mode;
    export const ModeNames = Types.Game.ModeNames;
    export type Flags = Types.Game.Flags;
    export const Flags = Types.Game.Flags;

    export type Extra<M extends Mode = Mode> = Types.Game.Extra<M>;
    export type Item<M extends Mode = Mode> = Types.Game.Item<M>;
    export type Step<M extends Mode = Mode> = Types.Game.Step<M>;

    export type Methods = Database.Game.Methods;
    export type Document = Database.Game.Document;
    export type Model = Database.Game.Model;
    export const Schema = Database.Game.Schema;
    export const Model = Database.Game.Model;
}

export namespace Score {
    export type Entity = Types.Score.Entity;

    export type Methods = Database.Score.Methods;
    export type Document = Database.Score.Document;
    export type Model = Database.Score.Model;
    export const Schema = Database.Score.Schema;
    export const Model = Database.Score.Model;
}

export namespace User {
    export type Entity = Types.User.Entity;
    export type Flags = Types.User.Flags;
    export const Flags = Types.User.Flags;

    export type Methods = Database.User.Methods;
    export type Document = Database.User.Document;
    export type Model = Database.User.Model;
    export const Schema = Database.User.Schema;
    export const Model = Database.User.Model;
}
