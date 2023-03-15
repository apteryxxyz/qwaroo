import type { Game } from '@qwaroo/client';
import { Validate } from '@qwaroo/common';
import type { APIGame } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRef, useState } from 'react';
import { Card } from '#/components/Card';
import { Button } from '#/components/Input/Button';
import { TagTextbox } from '#/components/Input/TagTextbox';
import { Textarea } from '#/components/Input/Textarea';
import { Textbox } from '#/components/Input/Textbox';
import { PageSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const client = useClient();

    const game = useRef<Game>(null!);
    if (!game.current) game.current = client.games.append(props.game);
    const [copy, setCopy] = useState(game.current.toJSON());

    function addChange(property: keyof APIGame, value: unknown) {
        setCopy(_ => ({ ..._, [property]: value }));
        return value;
    }

    function resetChanges() {
        setCopy(game.current.toJSON());
    }

    function saveChanges() {
        game.current.update(copy);
    }

    return <>
        <PageSeo
            url={WebRoutes.createGame()}
            title="Create Game"
            description="View your Qwaroo profile, containing your game statistics, achievements, created games, and more."
        />

        <h2>Edit Game</h2>

        <Card className="flex flex-col gap-5">
            {/* <h3 className="text-2xl font-bold">General Information</h3> */}

            <Field label="Title" description="Provide a title for your game.">
                <Textbox
                    className="bg-white dark:!bg-neutral-900"
                    mustMatch={Validate.Title}
                    value={copy.title}
                    setValue={_ => addChange('title', _)}
                    isRequired
                />
            </Field>

            <Field
                label="Headline"
                description="In 64 characters or less, provide a short and catchy phrase that describes your game. This will be displayed on your game's card."
            >
                <Textbox
                    className="bg-white dark:!bg-neutral-900"
                    mustMatch={Validate.ShortDescription}
                    value={copy.shortDescription}
                    onValue={_ => addChange('shortDescription', _)}
                    isRequired
                />
            </Field>

            <Field
                label="Long Description"
                description="Between 128 and 512 characters, provide a detailed description of your game. This will be displayed on your game's page."
            >
                <Textarea
                    className="bg-white dark:!bg-neutral-900"
                    mustMatch={Validate.LongDescription}
                    value={copy.longDescription}
                    onValue={_ => addChange('longDescription', _)}
                    isRequired
                />
            </Field>

            <Field
                label="Tags"
                description="Provide a list of tags that describe your game. These will be used to categorise your game. You can add up to 5 tags. Separate tags with a comma."
            >
                <TagTextbox
                    className="bg-white dark:!bg-neutral-900"
                    mustMatch={Validate.Category}
                    initialTags={copy.categories}
                    onChange={_ => addChange('categories', _)}
                    maxTags={5}
                />
            </Field>
        </Card>

        <div className="flex items-end justify-end gap-2">
            <Button onClick={resetChanges}>Cancel</Button>
            <Button onClick={saveChanges}>Save</Button>
        </div>
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    game: APIGame;
}> = async context => {
    const slug = String(context.params?.['slug'] ?? '');
    if (!slug) return { notFound: true };
    const client = useClient(context.req);
    if (!client.id) return { notFound: true };

    const game = await client.games.fetchOne(slug).catch(() => null);
    if (!game || game.creatorId !== client.id) return { notFound: true };

    return {
        props: { game: game.toJSON() },
    };
};

function Field(props: Field.Props) {
    return <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex flex-col lg:w-[30%] pr-10">
            <label className="text-lg">{props.label}</label>
            <small className="opacity-80">{props.description}</small>
        </div>

        <div className="flex-grow">{props.children}</div>
    </div>;
}

namespace Field {
    export interface Props {
        label: string;
        description: string;
        children: React.ReactNode;
    }
}
