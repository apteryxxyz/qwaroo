import type { Game } from '@qwaroo/client';
import type { ClientError } from '@qwaroo/common';
import { Validate } from '@qwaroo/common';
import type { APIGame } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Card } from '#/components/Card';
import { Field } from '#/components/Editor/Field';
import { Button } from '#/components/Input/Button';
import { Textarea } from '#/components/Input/Textarea';
import { MultipleTextbox } from '#/components/Input/Textbox/Multiple';
import { StringTextbox } from '#/components/Input/Textbox/String';
import { PageSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';
import { Extra } from '#/modes/HigherOrLower/Editor/Extra';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const client = useClient();
    const router = useRouter();

    useEffect(() => {
        // If the user is not logged in, redirect them to the login page
        const id = localStorage.getItem('qwaroo.user_id');
        const token = localStorage.getItem('qwaroo.token');
        if (!id || !token) void router.replace(WebRoutes.login());
    }, []);

    const game = useRef<Game>(null!);
    if (!game.current) game.current = client.games.append(props.game);

    const [data, setData] = useState(game.current.toJSON());
    const [dataErrors, setDataErrors] = useState<(string | null)[]>([]);
    const [extraErrors, setExtraErrors] = useState<(string | null)[]>([]);
    const [error, setError] = useState<ClientError | null>(null);

    function addDataChange(property: string, value: unknown) {
        setData(current => ({ ...current, [property]: value }));
    }

    function addDataValidation(index: number, error: string | null) {
        setDataErrors(current => {
            const errors = [...current];
            errors[index] = error;
            return errors;
        });
    }

    function addExtraValidation(index: number, error: string | null) {
        setExtraErrors(current => {
            const copy = [...current];
            copy[index] = error;
            return copy;
        });
    }

    return <>
        <PageSeo
            url={WebRoutes.editGame(props.game.slug)}
            title="Edit Game"
            description="Edit your game's information."
        />

        <h2>Edit Game</h2>

        <Card className="flex flex-col gap-5">
            <Field
                label="Title"
                description="Provide a title for your game, this cannot be changed."
            >
                <StringTextbox
                    mustMatch={Validate.Title}
                    value={String(data['title'] ?? '')}
                    isRequired
                    isDisabled
                />
            </Field>

            <Field
                label="Headline"
                description="In 64 characters or less, provide a short and catchy phrase that describes your game. This will be displayed on your game's card."
            >
                <StringTextbox
                    mustMatch={Validate.ShortDescription}
                    value={String(data['shortDescription'] ?? '')}
                    setValue={value => addDataChange('shortDescription', value)}
                    onValidate={error => addDataValidation(1, error)}
                    isRequired
                />
            </Field>

            <Field
                label="Long Description"
                description="Between 128 and 512 characters, provide a detailed description of your game. This will be displayed on your game's page."
            >
                <Textarea
                    mustMatch={Validate.LongDescription}
                    value={String(data['longDescription'] ?? '')}
                    setValue={value => addDataChange('longDescription', value)}
                    onValidate={error => addDataValidation(2, error)}
                    isRequired
                />
            </Field>

            <Field
                label="Thumbnail URL"
                description="Provide a URL to an image that will be used as your game's thumbnail. This will be displayed on your game's card."
            >
                <StringTextbox
                    mustMatch={Validate.ThumbnailURL}
                    value={String(data['thumbnailUrl'] ?? '')}
                    setValue={value => addDataChange('thumbnailUrl', value)}
                    onValidate={error => addDataValidation(3, error)}
                    isRequired
                />
            </Field>

            <Field
                label="Tags"
                description="To categorise your game, please provide a list of up to five tags that best describe it. Press enter to add a tag."
            >
                <MultipleTextbox
                    mustMatch={Validate.Category}
                    values={
                        Array.isArray(data['categories'])
                            ? data['categories']
                            : []
                    }
                    setValues={tags => addDataChange('categories', tags)}
                    onValidate={error => addDataValidation(4, error)}
                    minCount={1}
                    maxCount={5}
                />
            </Field>
        </Card>

        <Extra
            data={(data['extraData'] ?? {}) as Extra.Props['data']}
            setData={data => addDataChange('extraData', data)}
            onValidate={(index, error) => addExtraValidation(index, error)}
        />

        <div className="flex items-end justify-end gap-2">
            <Button
                isDisabled={[...dataErrors, ...extraErrors] //
                    .some(error => typeof error === 'string')}
                onClick={async () => {
                    await game.current
                        .edit(data)
                        .catch(error => setError(error))
                        .then(() =>
                            router.push(WebRoutes.game(game.current.slug))
                        );
                }}
            >
                Save
            </Button>
        </div>

        {error && <>
            <h2>Failed to Save Game</h2>

            <Card className="flex flex-col gap-5">
                <p className="text-neutral-500 dark:text-neutral-400">
                    {error.details ?? error.message}
                </p>
            </Card>
        </>}
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
