'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateData } from '../context';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Command } from '@/components/Command';
import { Form } from '@/components/Form';
import { Input } from '@/components/Input';
import { Popover } from '@/components/Popover';
import { Textarea } from '@/components/Textarea';
import { Tooltip } from '@/components/Tooltip';
import { cn } from '@/utilities/styling';

const Categories = ['Geography', 'YouTube'];

const detailsSchema = z.object({
    title: z.string().min(3).max(40),
    shortDescription: z.string().min(8).max(64),
    longDescription: z.string().min(96).max(512),
    thumbnailUrl: z.string().url().max(512),
    category: z.string().min(3).max(40),
    valueVerb: z.string().max(40),
    valueNoun: z.string().max(40),
    higherText: z.string().max(40),
    lowerText: z.string().max(40),
    valuePrefix: z.string().max(10).optional(),
    valueSuffix: z.string().max(10).optional(),
});

export default function Content() {
    const { source, setSource, options, setOptions, details, setDetails } = useCreateData() ?? {};
    if (!setSource || !setOptions) throw new Error('Missing context');

    const router = useRouter();
    const detailsForm = useForm<z.infer<typeof detailsSchema>>({
        resolver: zodResolver(detailsSchema),
        defaultValues: details,
    });

    useEffect(() => {
        const isAllowed = source && Object.keys(options).length > 0;
        if (!isAllowed) router.replace('/games/create');
    }, []);

    return <Form {...detailsForm}>
        <form
            onSubmit={detailsForm.handleSubmit(values => {
                setDetails(values);
                router.push('/games/create/process');
            })}
            className="flex-grow flex flex-col gap-6"
        >
            <Card>
                <Card.Header>
                    <Card.Title>Choose your descriptive values</Card.Title>
                </Card.Header>

                <Card.Content className="flex flex-col gap-6">
                    <Form.Field
                        control={detailsForm.control}
                        name="title"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Title</Form.Label>
                                <Form.Description>
                                    Provide a title for your game, this cannot be changed.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="shortDescription"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Short Description</Form.Label>
                                <Form.Description>
                                    In 64 characters or less, provide a short and catchy phrase that
                                    describes your game. This will be displayed on your game's card.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="longDescription"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Long Description</Form.Label>
                                <Form.Description>
                                    Between 96 and 512 characters, provide a detailed description of
                                    your game. This will be displayed on your game's page.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Textarea {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="thumbnailUrl"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Thumbnail URL</Form.Label>
                                <Form.Description>
                                    Provide a URL to an image that will be used as your game's
                                    thumbnail. This will be displayed on your game's card.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="category"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Category</Form.Label>
                                <Form.Description>
                                    Choose the category that best fits your game.
                                </Form.Description>
                            </div>

                            <Popover>
                                <div className="flex flex-col">
                                    <Popover.Trigger asChild>
                                        <Form.Control>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-[200px]"
                                            >
                                                {field.value ?? 'Choose a category'}{' '}
                                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </Form.Control>
                                    </Popover.Trigger>
                                    <Form.Message />
                                </div>

                                <Popover.Content className="flex-grow w-[200px] p-0">
                                    <Command>
                                        <Command.Input placeholder="Search categories..." />
                                        <Command.Empty>No categories found.</Command.Empty>

                                        <Command.Group>
                                            {Categories.map(category => <Command.Item
                                                key={category}
                                                value={category}
                                                onSelect={() =>
                                                    detailsForm.setValue('category', category)
                                                }
                                            >
                                                <CheckIcon
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        category === field.value
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {category}
                                            </Command.Item>)}
                                        </Command.Group>
                                    </Command>
                                </Popover.Content>
                            </Popover>
                        </Form.Item>}
                    />
                    {/* 
                    <Link href="#tech" className="ml-auto">
                        <Button>Continue</Button>
                    </Link> */}
                </Card.Content>
            </Card>

            <Card id="tech">
                <Card.Header>
                    <Card.Title>Choose your technical values</Card.Title>
                </Card.Header>

                <Card.Content className="flex flex-col gap-6">
                    <Form.Field
                        control={detailsForm.control}
                        name="valueVerb"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Unit Verb</Form.Label>
                                <Form.Description>
                                    Appears before the value, describes how the value relates to the
                                    noun, such as 'costs' or 'has'.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="valueNoun"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Unit Noun</Form.Label>
                                <Form.Description>
                                    The unit that the values are, such as 'views' or 'people'.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="higherText"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Higher Synonym</Form.Label>
                                <Form.Description>
                                    A synonym of higher that will appear in-game as the higher
                                    button, for example, 'More', 'Better', etc.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="lowerText"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Lower Synonym</Form.Label>
                                <Form.Description>
                                    A synonym of lower that will appear in-game as the lower button,
                                    for example, 'Less', 'Worse', etc.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="valuePrefix"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Value Prefix (Optional)</Form.Label>
                                <Form.Description>
                                    Appears as a prefix to the value, for example a currency symbol.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Form.Field
                        control={detailsForm.control}
                        name="valueSuffix"
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">Value Suffix (Optional)</Form.Label>
                                <Form.Description>
                                    Appears as a suffix to the value, for example weight or speed
                                    units. Can be empty.
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />

                    <Tooltip.Provider>
                        <Tooltip>
                            <Tooltip.Trigger asChild>
                                <Button type="submit" className="ml-auto">
                                    Create
                                </Button>
                            </Tooltip.Trigger>

                            <Tooltip.Content>Game creation is currently disabled.</Tooltip.Content>
                        </Tooltip>
                    </Tooltip.Provider>
                </Card.Content>
            </Card>
        </form>
    </Form>;
}
