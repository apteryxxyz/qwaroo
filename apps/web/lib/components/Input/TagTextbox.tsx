import { faRemove } from '@fortawesome/free-solid-svg-icons/faRemove';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Textbox } from './Textbox';

export function TagTextbox(props: TagTextbox.Props) {
    const [value, setValue] = useState('');

    function onChange(value: string, key: string) {
        if ((key !== ',' && key !== 'Enter') || !value) return;
        if (props.tags.length >= (props.maxTags ?? 10)) return;

        const additionalTags = value
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);
        props.setTags(tags => [...new Set([...tags, ...additionalTags])]);

        setValue('');
    }

    function removeTag(tag: string) {
        props.setTags(tags => tags.filter(t => t !== tag));
    }

    return <div className="flex flex-col gap-2">
        <Textbox
            {...props}
            onValue={() => null}
            onKeyUp={onChange}
            value={value}
            setValue={setValue}
            isDisabled={props.tags.length >= (props.maxTags ?? 10)}
        />

        <div className="flex flex-row gap-3 mx-1">
            {props.tags.map(tag => <div
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
        className?: string;
        placeHolder?: string;
        ariaRole?: string;

        tags: string[];
        setTags: Dispatch<SetStateAction<string[]>>;
        maxTags?: number;
    }
}
