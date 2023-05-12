import type { Game } from '@qwaroo/client';
import { Validate } from '@qwaroo/common';
import type { APIGame } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { Card } from '#/components/Card';
import { Field } from '#/components/Editor/Field';
import { Button } from '#/components/Input/Button';
import { TagTextbox } from '#/components/Input/TagTextbox';
import { Textarea } from '#/components/Input/Textarea';
import { Textbox } from '#/components/Input/Textbox';
import { StringTextbox } from '#/components/Input/Textbox/String';
import { PageSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';
import { Extra } from '#/modes/HigherOrLower/Editor/Extra';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const client = useClient();
    const router = useRouter();

    const game = useRef<Game>(null!);
    if (!game.current) game.current = client.games.append(props.game);
    const [copy, setCopy] = useState(game.current.toJSON());

    function addChange(property: keyof APIGame, value: unknown) {
        setCopy(current => ({ ...current, [property]: value }));
        return value;
    }

    async function resetChanges() {
        await router.push(WebRoutes.game(game.current.slug));
    }

    async function saveChanges() {
        await game.current
            .edit(copy)
            .then(() => router.push(WebRoutes.game(game.current.slug)));
    }

    return <>
        <PageSeo
            url={WebRoutes.editGame(props.game.slug)}
            title="Edit Game"
            description="Edit your game's information."
        />

        <h2>Edit Game</h2>

        <Card className="flex flex-col gap-5">
            <Field label="Title" description="Provide a title for your game.">
                <StringTextbox
                    value={copy.title}
                    setValue={value => addChange('title', value)}
                    mustMatch={Validate.Title}
                    isRequired
                    isDisabled
                />
            </Field>

            <Field
                label="Headline"
                description="In 64 characters or less, provide a short and catchy phrase that describes your game. This will be displayed on your game's card."
            >
                <StringTextbox
                    value={copy.shortDescription}
                    setValue={value => addChange('shortDescription', value)}
                    mustMatch={Validate.ShortDescription}
                    isRequired
                />
            </Field>

            <Field
                label="Long Description"
                description="Between 128 and 512 characters, provide a detailed description of your game. This will be displayed on your game's page."
            >
                <Textarea
                    value={copy.longDescription}
                    setValue={value => addChange('longDescription', value)}
                    mustMatch={Validate.LongDescription}
                    isRequired
                />
            </Field>

            <Field
                label="Tags"
                description="To categorise your game, please provide a list of up to five tags that best describe it. Press enter to add a tag."
            >
                <TagTextbox
                    className="bg-white dark:!bg-neutral-900"
                    mustMatch={Validate.Category}
                    tags={copy.categories}
                    setTags={_ => addChange('categories', _)}
                    maxTags={5}
                />
            </Field>
        </Card>

        <Extra
            data={copy.extraData}
            setData={_ => addChange('extraData', _)}
            // TODO: Implement validation
            onValidate={() => null}
        />

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
