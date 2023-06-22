'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Source } from '@qwaroo/data-sources';
import { useRouter } from 'next/navigation';
import type { ServerActionError } from 'next-sa/client';
import { executeServerAction } from 'next-sa/client';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import ClipLoader from 'react-spinners/ClipLoader';
import z from 'zod';
import { validateOptions } from '../actions';
import { useCreateData } from '../context';
import { AlertDialog } from '@/components/AlertDialog';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Form } from '@/components/Form';
import { Input } from '@/components/Input';
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
    const [isValidating, setValidating] = useState(false);
    const [isAlertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const optionsSchema = buildSchema(props.source);
    const optionsForm = useForm<z.infer<typeof optionsSchema>>({
        resolver: zodResolver(optionsSchema),
        defaultValues: options,
    });

    const onSubmit = useCallback(async () => {
        const options = optionsForm.getValues();
        const input = { slug: props.source.slug, options };

        setValidating(true);
        await executeServerAction(validateOptions, input)
            .then(message => {
                setAlertMessage(message);
                setAlertOpen(true);
            })
            .catch((error: ServerActionError) =>
                toast({
                    title: 'Inputted options are invalid!',
                    description: error.message,
                    variant: 'destructive',
                })
            )
            .finally(() => setValidating(false));
    }, []);

    return <Card>
        <Card.Header>
            <Card.Title>Choose your source options</Card.Title>
        </Card.Header>

        <Card.Content>
            <Form {...optionsForm}>
                <form className="flex flex-col gap-6" onSubmit={optionsForm.handleSubmit(onSubmit)}>
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

                    <Button type="submit" className="flex gap-2 ml-auto" disabled={isValidating}>
                        {isValidating && <ClipLoader size={16} color="#000" />}
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
