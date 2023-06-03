'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Source } from '@qwaroo/data-sources';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateData } from '../context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Form } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

interface ContentProps {
    source: Source.Entity;
}

export default function Content(props: ContentProps) {
    const { source, setSource, options, setOptions } = useCreateData() ?? {};
    if (!setSource || !setOptions) throw new Error('Missing context');

    const router = useRouter();
    if (!source && setSource) setSource(props.source);
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
                    onSubmit={optionsForm.handleSubmit(values => {
                        setOptions(values);
                        router.push('/games/create/details');
                    })}
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

                    <Button type="submit" className="ml-auto">
                        Continue
                    </Button>
                </form>
            </Form>
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
