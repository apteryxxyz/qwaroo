'use client';

import type { Source } from '@qwaroo/sources';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { PieChartIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AlertDialog } from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Form } from '@/components/form';
import { Input } from '@/components/input';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/services/trpc';
import { useCreate } from '../context';

interface ContentProps {
  source: Source.Entity;
}

export default function Content(p: ContentProps) {
  const creating = useCreate();
  if (!creating?.setSource || !creating.setProperties)
    throw new Error('Missing context');
  if (!creating.source && creating.setSource) creating.setSource(p.source);

  const context = trpc.useContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isValidating, setValidating] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const propertiesValidator = buildSchema(p.source);
  const propertiesForm = useForm<z.infer<typeof propertiesValidator>>({
    resolver: zodResolver(propertiesValidator),
    defaultValues: creating.properties ?? {},
  });

  const onSubmit = useCallback(async () => {
    setValidating(true);
    const properties = propertiesForm.getValues();
    await context.create.validateProperties //
      .fetch({ slug: p.source.slug, properties })
      .then((message) => {
        setAlertMessage(message);
        setAlertOpen(true);
      })
      .catch((error: Error) =>
        toast({
          title: 'Inputted properties are invalid!',
          description: error.message,
          variant: 'destructive',
        }),
      );
  }, [propertiesForm, context.create.validateProperties, p.source.slug, toast]);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Choose your source options</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form {...propertiesForm}>
          <form
            className="flex flex-col gap-6"
            onSubmit={propertiesForm.handleSubmit(onSubmit)}
          >
            {Object.entries<Source.Prop>(p.source.properties).map(
              ([key, value]) => (
                <Form.Field
                  key={key}
                  control={propertiesForm.control}
                  name={key}
                  render={({ field }) => (
                    <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                      <div className="lg:w-1/3">
                        <Form.Label className="block">{value.name}</Form.Label>
                        <Form.Description>
                          {value.description || 'No description, yet...'}
                        </Form.Description>
                      </div>

                      <div className="flex-grow">
                        <Form.Control>
                          {/* // TODO: Support numbers and booleans */}
                          <Input type="text" {...field} />
                        </Form.Control>
                        <Form.Message />
                      </div>
                    </Form.Item>
                  )}
                />
              ),
            )}

            <Button
              type="submit"
              disabled={isValidating}
              className="ml-auto flex gap-2"
            >
              {isValidating && (
                <PieChartIcon className="mr-1 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </form>
        </Form>

        <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Do you wish to continue?</AlertDialog.Title>
              {alertMessage && (
                <AlertDialog.Description>
                  {alertMessage}
                </AlertDialog.Description>
              )}
            </AlertDialog.Header>

            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={() => {
                  creating.setProperties(propertiesForm.getValues());
                  router.push('/games/create/details');
                }}
              >
                Continue
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Card.Content>
    </Card>
  );
}

// NOTE: Not the biggest fan of this, but it works for now
function buildSchema(source: Source.Entity) {
  const entries = Object.entries<Source.Prop>(source.properties).map(
    ([key, value]) => {
      let zod: z.ZodTypeAny;

      switch (value.type) {
        case 'string': {
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
          break;
        }

        case 'number': {
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
          break;
        }

        default: {
          zod = z.boolean();
          break;
        }
      }

      if ('options' in value && value.options !== undefined) {
        const values = value.options.map((option) => option.value);
        zod = zod.transform((value: string | number) => {
          if (value === undefined) return undefined;
          else if (values.includes(value)) return value;
          else throw new Error('Invalid value');
        });
      }

      if (!value.required) zod = zod.optional();

      return [key, zod];
    },
  );

  return z.object(Object.fromEntries(entries));
}
