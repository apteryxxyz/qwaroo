import type { Game } from '@qwaroo/client';
import { Card } from '#/components/Card';
import { Field } from '#/components/Editor/Field';
import { StringTextbox } from '#/components/Input/Textbox/String';

export function Extra(props: Extra.Props) {
    function addExtraChange(property: string, value: unknown) {
        props.setData({ ...props.data, [property]: value });
    }

    return <Card className="flex flex-col gap-5">
        <Field
            label="Verb"
            description="Appears before the value, describes how the value relates to the noun, such as 'costs' or 'has'."
        >
            <StringTextbox
                value={props.data.valueVerb}
                setValue={value => addExtraChange('valueVerb', value)}
                onValidate={isValid => props.onValidate(3, isValid)}
                isRequired
            />
        </Field>

        <Field
            label="Higher Synonym"
            description="A synonym of higher that will appear in-game as the higher button, for example, 'More', 'Better', etc."
        >
            <StringTextbox
                value={props.data.higherText}
                setValue={value => addExtraChange('higherText', value)}
                onValidate={isValid => props.onValidate(0, isValid)}
                isRequired
            />
        </Field>

        <Field
            label="Lower Synonym"
            description="A synonym of lower that will appear in-game as the lower button, for example, 'Less', 'Worse', etc."
        >
            <StringTextbox
                value={props.data.lowerText}
                setValue={value => addExtraChange('lowerText', value)}
                onValidate={isValid => props.onValidate(1, isValid)}
                isRequired
            />
        </Field>

        <Field
            label="Noun"
            description="The unit that the values are, such as 'money' or 'people'."
        >
            <StringTextbox
                value={props.data.valueNoun}
                setValue={value => addExtraChange('valueNoun', value)}
                onValidate={isValid => props.onValidate(2, isValid)}
                isRequired
            />
        </Field>

        <Field
            label="Prefix"
            description="Appears as a prefix to the value, for example a currency symbol. Can be empty."
        >
            <StringTextbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.valuePrefix}
                setValue={value => addExtraChange('valuePrefix', value ?? '')}
                onValidate={isValid => props.onValidate(4, isValid)}
            />
        </Field>

        <Field
            label="Suffix"
            description="Appears as a suffix to the value, for example weight or speed units. Can be empty."
        >
            <StringTextbox
                className="bg-white dark:!bg-neutral-900"
                value={props.data.valueSuffix}
                setValue={value => addExtraChange('valueSuffix', value ?? '')}
                onValidate={isValid => props.onValidate(5, isValid)}
            />
        </Field>
    </Card>;
}

export namespace Extra {
    export interface Props {
        data: Game.Extra;
        setData(data: Game.Extra): void;
        onValidate(index: number, error: string | null): void;
    }
}
