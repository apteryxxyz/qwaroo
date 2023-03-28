import type { Game } from '@qwaroo/client';
import { Card } from '#/components/Card';
import { Field } from '#/components/Editor/Field';
import { Textbox } from '#/components/Input/Textbox';

export function Extra(props: Extra.Props) {
    function addChange(property: keyof Game.Extra, value: unknown) {
        props.setData({ ...props.data, [property]: value });
        return value;
    }

    return <Card className="flex flex-col gap-5">
        <Field
            label="Higher Synonym"
            description="A synonym of higher that will appear in-game as the higher button, for example, 'More', 'Better', etc."
        >
            <Textbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.higherText}
                setValue={_ => addChange('higherText', _)}
                isRequired
            />
        </Field>

        <Field
            label="Lower Synonym"
            description="A synonym of lower that will appear in-game as the lower button, for example, 'Less', 'Worse', etc."
        >
            <Textbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.lowerText}
                setValue={_ => addChange('lowerText', _)}
                isRequired
            />
        </Field>

        <Field
            label="Noun"
            description="The unit that the values are, such as 'money' or 'people'."
        >
            <Textbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.valueNoun}
                setValue={_ => addChange('valueNoun', _)}
                isRequired
            />
        </Field>

        <Field
            label="Verb"
            description="Appears before the value, describes how the value relates to the noun, such as 'costs' or 'has'."
        >
            <Textbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.valueVerb}
                setValue={_ => addChange('valueVerb', _)}
                isRequired
            />
        </Field>

        <Field
            label="Prefix"
            description="Appears as a prefix to the value, for example a currency symbol. Can be empty."
        >
            <Textbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.valuePrefix}
                setValue={_ => addChange('valuePrefix', _ ?? '')}
            />
        </Field>

        <Field
            label="Suffix"
            description="Appears as a suffix to the value, for example weight or speed units. Can be empty."
        >
            <Textbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.valueSuffix}
                setValue={_ => addChange('valueSuffix', _ ?? '')}
            />
        </Field>
    </Card>;
}

export namespace Extra {
    export interface Props {
        data: Game.Extra;
        setData(data: Game.Extra): void;
    }
}
