import { faRemove } from '@fortawesome/free-solid-svg-icons/faRemove';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Textbox } from './Textbox';

export function TagTextbox(props: TagTextbox.Props) {
    const [value, setValue] = useState('');
    const [tags, setTags] = useState(props.initialTags ?? []);

    function onChange(value: string, key: string) {
        if ((key !== ',' && key !== 'Enter') || !value) return;
        if (tags.length >= (props.maxTags ?? 10)) return;

        const newTags = Array.from(
            new Set([
                ...tags,
                ...value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(Boolean),
            ])
        );

        setTags(newTags);
        props.onChange(newTags);
        setValue('');
    }

    function removeTag(tag: string) {
        const newTags = tags.filter(t => t !== tag);
        setTags(newTags);
        props.onChange(newTags);
    }

    return <div className="flex flex-col gap-2">
        <Textbox
            {...props}
            onValue={() => null}
            onKeyUp={onChange}
            value={value}
            setValue={setValue}
            isDisabled={tags.length >= (props.maxTags ?? 10)}
        />

        <div className="flex flex-row gap-3 mx-1">
            {tags.map(tag => <div
                key={tag}
                className={`bg-neutral-100 dark:bg-neutral-800 rounded-xl p-2 ${
                    props.className ?? ''
                }`}
            >
                {tag}

                <button className="ml-2" onClick={() => removeTag(tag)}>
                    <FontAwesomeIcon icon={faRemove} />
                </button>
            </div>)}
        </div>
    </div>;
}

export namespace TagTextbox {
    export interface Props {
        // Visual properties
        className?: string;
        placeHolder?: string;
        ariaRole?: string;

        // Tag-related properties
        initialTags?: string[];
        onChange(tags: string[]): void;
        maxTags?: number;
        mustMatch?: RegExp;
    }
}
