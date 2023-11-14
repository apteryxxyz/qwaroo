import { Game } from '@qwaroo/shared/types';

export abstract class Source<TModes extends readonly Game.Mode[], TProperties> {
  public abstract readonly slug: string;
  public abstract readonly name: string;
  public abstract readonly modes: TModes;
  public abstract properties: Record<keyof TProperties, Source.Prop>;

  public fetchItems(mode: TModes[number], properties: TProperties) {
    switch (mode) {
      case Game.Mode.HigherOrLower:
        return this.fetchHigherOrLowerItems(properties);
      default:
        throw new Error(`Unsupported mode ${mode} for source ${this.slug}.`);
    }
  }

  public fetchHigherOrLowerItems(properties: TProperties) {
    void properties;
    throw new Error('Unsupported mode for source.');
    // @ts-expect-error - Needed for type inference.
    return [] as Promise<Game.HigherOrLower.Item[]>;
  }
}

export namespace Source {
  export enum PropType {
    String = 'string',
    Number = 'number',
  }

  interface BaseProp {
    type: PropType;
    message: string;
    required?: boolean;
  }

  export interface StringProp extends BaseProp {
    type: PropType.String;
    choices?: readonly { name: string; value: string }[];
    default?: string;
  }

  export interface NumberProp extends BaseProp {
    type: PropType.Number;
    default?: number;
  }

  export type Prop = StringProp | NumberProp;
}
