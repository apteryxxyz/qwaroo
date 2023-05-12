import { Game } from '@qwaroo/client';
import type { ClientError } from '@qwaroo/common';
import { Slug, Validate } from '@qwaroo/common';
import type { APIGame, APISource } from '@qwaroo/types';
import { WebRoutes } from '@qwaroo/types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card } from '#/components/Card';
import { Field } from '#/components/Editor/Field';
import { Property } from '#/components/Editor/Property';
import { Source } from '#/components/Editor/Source';
import { Button } from '#/components/Input/Button';
import { Textarea } from '#/components/Input/Textarea';
import { MultipleTextbox } from '#/components/Input/Textbox/Multiple';
import { StringTextbox } from '#/components/Input/Textbox/String';
import { Loading } from '#/components/Loading';
import { PageSeo } from '#/components/Seo';
import { useClient } from '#/contexts/Client';
import { Extra } from '#/modes/HigherOrLower/Editor/Extra';

export default (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const client = useClient();
    const router = useRouter();
    const [sectionIndex, setSectionIndex] = useState(0);

    useEffect(() => {
        // If the user is not logged in, redirect them to the login page
        const id = localStorage.getItem('qwaroo.user_id');
        const token = localStorage.getItem('qwaroo.token');
        if (!id || !token) void router.replace(WebRoutes.login());
        else setSectionIndex(index => index + 1);
    }, []);

    const [source, setSource] = useState<APISource | null>(null);
    const [properties, setProperties] = useState<Record<string, unknown>>({});
    const [propertiesErrors, setPropertiesErrors] = useState<(string | null)[]>(
        []
    );
    const [data, setData] = useState<Record<string, unknown>>({});
    const [dataErrors, setDataErrors] = useState<(string | null)[]>([]);
    const [extraValid, setExtraValid] = useState<boolean[]>([]);
    const [error, setError] = useState<ClientError | null>(null);

    function addPropertiesChange(property: string, value: unknown) {
        setProperties(current => ({ ...current, [property]: value }));
    }

    function addPropertiesValidation(index: number, error: string | null) {
        setPropertiesErrors(current => {
            const copy = [...current];
            copy[index] = error;
            return copy;
        });
    }

    function addDataChange(property: string, value: unknown) {
        setData(current => ({ ...current, [property]: value }));
    }

    function addDataValidation(index: number, error: string | null) {
        setDataErrors(current => {
            const copy = [...current];
            copy[index] = error;
            return copy;
        });
    }

    function addExtraValidation(index: number, error: boolean) {
        setExtraValid(current => {
            const copy = [...current];
            copy[index] = error;
            return copy;
        });
    }

    function isTitleTaken(title: string) {
        // Really shouldn't be making a request for every character typed
        // but it's the easiest way to do it for now
        return client.games
            .fetchOne(Slug.createWithTransliteration(title))
            .then(game => game !== null)
            .catch(() => false);
    }

    useEffect(() => {
        // Fill in the properties with the default values
        if (!source) return;

        const propertiesWithDefaults = source.properties
            .filter(property => property.default !== undefined)
            .map(property => [property.key, property.default] as const);
        setProperties(Object.fromEntries(propertiesWithDefaults));
    }, [source]);

    return <>
        <PageSeo
            url={WebRoutes.createGame()}
            title="Create Game"
            description="Create your very game custom game of Higher or Lower in only a few clicks and share it with your friends!"
        />

        {sectionIndex === 0 && <>
            <Loading.Circle />
        </>}

        {sectionIndex === 1 && <>
            <h2>
                Choose A Source{' '}
                <small className="text-sm font-normal">(1 of 4)</small>
            </h2>

            <p>
                Games are automatically created using a source and a set of
                properties. Choose a source from below to get started. More
                options will be available soon!
            </p>

            <div>
                {props.sources.map(source => <Source
                    key={source.slug}
                    source={source}
                    onClick={() => {
                        setSource(source);
                        setSectionIndex(index => index + 1);
                    }}
                />)}
            </div>
        </>}

        {sectionIndex === 2 && source && <>
            <h2>
                Choose Source Options{' '}
                <small className="text-sm font-normal">(2 of 4)</small>
            </h2>

            <Card className="flex flex-col gap-5">
                {source.properties.map((property, index) => <Field
                    key={property.key}
                    label={property.name}
                    description={property.description}
                >
                    <Property
                        property={property}
                        value={properties[property.key]}
                        onChange={value =>
                            addPropertiesChange(property.key, value)
                        }
                        onValidate={error =>
                            addPropertiesValidation(index, error)
                        }
                    />
                </Field>)}
            </Card>

            <div className="flex items-end justify-end gap-2">
                <Button onClick={() => setSectionIndex(index => index - 1)}>
                    Back
                </Button>
                <Button
                    onClick={() => setSectionIndex(index => index + 1)}
                    isDisabled={propertiesErrors.some(error => error !== null)}
                >
                    Continue
                </Button>
            </div>
        </>}

        {sectionIndex === 3 && <>
            <h2>
                Choose Descriptive{' '}
                <small className="text-sm font-normal">(3 of 4)</small>
            </h2>

            <Card className="flex flex-col gap-5">
                <Field
                    label="Title"
                    description="Provide a title for your game, this cannot be changed."
                >
                    <StringTextbox
                        mustMatch={Validate.Title}
                        value={String(data['title'] ?? '')}
                        setValue={value => addDataChange('title', value)}
                        onValidate={error => addDataValidation(0, error)}
                        additionalValidation={async value => {
                            const taken =
                                (await isTitleTaken(value)) ||
                                value.toLowerCase() === 'create';
                            return taken ? 'Title is already taken' : null;
                        }}
                        isRequired
                    />
                </Field>

                <Field
                    label="Headline"
                    description="In 64 characters or less, provide a short and catchy phrase that describes your game. This will be displayed on your game's card."
                >
                    <StringTextbox
                        mustMatch={Validate.ShortDescription}
                        value={String(data['shortDescription'] ?? '')}
                        setValue={value =>
                            addDataChange('shortDescription', value)
                        }
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
                        setValue={value =>
                            addDataChange('longDescription', value)
                        }
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
                        minCount={1}
                        maxCount={5}
                    />
                </Field>
            </Card>

            <div className="flex items-end justify-end gap-2">
                <Button onClick={() => setSectionIndex(index => index - 1)}>
                    Back
                </Button>
                <Button
                    onClick={() => setSectionIndex(index => index + 1)}
                    isDisabled={dataErrors.some(error => error !== null)}
                >
                    Continue
                </Button>
            </div>
        </>}

        {sectionIndex === 4 && source && <>
            <h2>
                Choose Game Options{' '}
                <small className="text-sm font-normal">(4 of 4)</small>
            </h2>

            <Extra
                data={(data['extraData'] ?? {}) as Extra.Props['data']}
                setData={data => addDataChange('extraData', data)}
                onValidate={(index, error) => addExtraValidation(index, error)}
            />

            <div className="flex items-end justify-end gap-2">
                <Button onClick={() => setSectionIndex(index => index - 1)}>
                    Back
                </Button>
                <Button
                    isDisabled={extraValid.includes(false)}
                    onClick={async () => {
                        setSectionIndex(index => index + 1);

                        const game = await client.games
                            .createGame({
                                ...(data as unknown as APIGame),
                                mode: Game.Mode.HigherOrLower,
                                sourceSlug: source.slug,
                                sourceProperties: properties,
                            })
                            .catch(error => {
                                setSectionIndex(-1);
                                setError(error);
                            });

                        if (game) void router.push(WebRoutes.game(game.slug));
                    }}
                >
                    Create
                </Button>
            </div>
        </>}

        {sectionIndex === 5 && <>
            <h2>Creating Game...</h2>

            <p>
                This will take a few minutes as we fetch the data from the
                source and create your game, please wait.
            </p>

            <div>
                <Loading.Circle />
            </div>
        </>}

        {error && <>
            <h2>Failed to Create Game</h2>

            <Card className="flex flex-col gap-5">
                <p className="text-neutral-500 dark:text-neutral-400">
                    {error.details ?? error.message}
                </p>
            </Card>
        </>}
    </>;
};

export const getServerSideProps: GetServerSideProps<{
    sources: APISource[];
}> = async context => {
    const client = useClient(context.req);
    const sources = await client.games.fetchSources().catch(() => []);
    return { props: { sources } };
};
