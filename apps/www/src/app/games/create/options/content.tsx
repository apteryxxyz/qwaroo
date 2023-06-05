'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Source } from '@qwaroo/data-sources';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { validateOptions } from '../actions';
import { useCreateData } from '../context';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Form } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/utilities/useToast';

interface ContentProps {
    source: Source.Entity;
}

export default function Content(props: ContentProps) {
    const { source, setSource, options, setOptions } = useCreateData() ?? {};
    if (!setSource || !setOptions) throw new Error('Missing context');
    if (!source && setSource) setSource(props.source);

    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isAlertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const optionsSchema = buildSchema(props.source);
    const optionsForm = useForm<z.infer<typeof optionsSchema>>({
        resolver: zodResolver(optionsSchema),
        defaultValues: options,
    });

    return <Card>
        <Card.Header>
            <Card.Title>Choose your source options</Card.Title>
        </Card.Header>

        <Card.Content>
            <Form {...optionsForm}>
                <form
                    className="flex flex-col gap-6"
                    onSubmit={optionsForm.handleSubmit(options =>
                        startTransition(async () => {
                            const result = await validateOptions({
                                slug: props.source.slug,
                                options,
                            });
                            if (result[0] === false) {
                                toast({
                                    title: 'Inputted options are invalid!',
                                    description: result[1],
                                    variant: 'destructive',
                                });
                            } else {
                                setAlertMessage(result[1] ?? '');
                                setAlertOpen(true);
                            }
                        })
                    )}
                >
                    {Object.entries(props.source.properties).map(([key, value]) => <Form.Field
                        key={key}
                        control={optionsForm.control}
                        name={key}
                        render={({
                            field,
                        }) => <Form.Item className="space-y-0 flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <Form.Label className="block">{value.name}</Form.Label>
                                <Form.Description>
                                    {value.description || 'No description, yet...'}
                                </Form.Description>
                            </div>

                            <div className="flex-grow">
                                <Form.Control>
                                    {/* TODO: Support numbers and booleans */}
                                    <Input type="text" {...field} />
                                </Form.Control>
                                <Form.Message />
                            </div>
                        </Form.Item>}
                    />)}

                    <Button type="submit" className="ml-auto" disabled={isPending}>
                        Continue
                    </Button>
                </form>
            </Form>

            <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>Do you wish to continue?</AlertDialog.Title>
                        {alertMessage && <AlertDialog.Description>
                            {alertMessage}
                        </AlertDialog.Description>}
                    </AlertDialog.Header>

                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action
                            onClick={() => {
                                setOptions(optionsForm.getValues());
                                router.push('/games/create/details');
                            }}
                        >
                            Continue
                        </AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Card.Content>
    </Card>;
}

function buildSchema(source: Source.Entity) {
    const entries = Object.entries(source.properties).map(([key, value]) => {
        let zod: z.ZodTypeAny;

        if (value.type === 'string') {
            let innerZod = z.string();
            if ('minimum' in value && value.minimum !== undefined)
                innerZod = innerZod.min(value.minimum, {
                    message: `Must be at least ${value.minimum} characters`,
                });
            if ('maximum' in value && value.maximum !== undefined)
                innerZod = innerZod.max(value.maximum, {
                    message: `Must be at most ${value.maximum} characters`,
                });
            zod = innerZod;
        }
        //
        else if (value.type === 'number') {
            let innerZod = z.number();
            if ('minimum' in value && value.minimum !== undefined)
                innerZod = innerZod.min(value.minimum, {
                    message: `Must be greater than or equal to ${value.minimum}`,
                });
            if ('maximum' in value && value.maximum !== undefined)
                innerZod = innerZod.max(value.maximum, {
                    message: `Must be less than or equal to ${value.maximum}`,
                });
            zod = innerZod;
        }
        //
        else zod = z.boolean();

        if ('options' in value && value.options !== undefined) {
            const values = value.options.map(option => option.value);
            zod = zod.transform(value => {
                if (value === undefined) return undefined;
                else if (values.includes(value)) return value;
                else throw new Error('Invalid value');
            });
        }

        if (!value.required) zod = zod.optional();

        return [key, zod];
    });

    return z.object(Object.fromEntries(entries));
}
