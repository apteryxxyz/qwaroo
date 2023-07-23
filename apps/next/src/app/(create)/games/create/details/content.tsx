'use client';

import { GameDetailsSchema } from '@qwaroo/validators';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import type z from 'zod';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Command } from '@/components/command';
import { Dropzone } from '@/components/dropzone';
import { Form } from '@/components/form';
import { Input } from '@/components/input';
import { Popover } from '@/components/popover';
import { Textarea } from '@/components/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/utilities/styling';
import { useCreate } from '../context';

export default function Content() {
  const creating = useCreate();
  if (!creating?.setSource || !creating.setProperties)
    throw new Error('Missing context');

  const router = useRouter();
  const { toast } = useToast();

  const detailsForm = useForm<z.infer<typeof GameDetailsSchema>>({
    resolver: zodResolver(GameDetailsSchema),
    defaultValues: creating.details ?? undefined,
  });

  useEffect(() => {
    if (!creating.source || !creating.properties)
      router.replace('/games/create');
  }, [creating.properties, creating.source, router]);
  if (!creating.source || !creating.properties) return null;

  return (
    <Form {...detailsForm}>
      <form
        className="flex flex-grow flex-col gap-6"
        onSubmit={detailsForm.handleSubmit((values) => {
          console.log(creating, values);
          creating.setDetails(values);
          router.push('/games/create/process');
        }, console.log)}
      >
        <Card>
          <Card.Header>
            <Card.Title>Choose your descriptive values</Card.Title>
          </Card.Header>

          <Card.Content className="flex flex-col gap-6">
            <Form.Field
              control={detailsForm.control}
              name="title"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Title</Form.Label>
                    <Form.Description>
                      Provide a title for your game.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="shortDescription"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Short Description</Form.Label>
                    <Form.Description>
                      In 64 characters or less, provide a short and catchy
                      phrase that describes your game. This will be displayed on
                      your game&apos;s card.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="longDescription"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Long Description</Form.Label>
                    <Form.Description>
                      Between 96 and 512 characters, provide a detailed
                      description of your game. This will be displayed on your
                      game&apos;s page.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="thumbnailBinary"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Thumbnail</Form.Label>
                    <Form.Description>
                      Provide an image that will be used as your game&apos;s
                      thumbnail. This will be displayed on your game&apos;s
                      card.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Dropzone
                      field={field}
                      accept={{
                        'image/png': [],
                        'image/jpeg': [],
                      }}
                      maxFiles={1}
                      maxSize={1_024 * 1_024 * 2}
                      restrictionText="PNG or JPEG (MAX. 2MB)"
                      onFileError={(error) =>
                        toast({
                          title: 'Inputted file is invalid!',
                          description: error.message,
                          variant: 'destructive',
                        })
                      }
                    />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="category"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
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
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </Form.Control>
                      </Popover.Trigger>
                      <Form.Message />
                    </div>

                    <Popover.Content className="w-[200px] flex-grow p-0">
                      <Command>
                        <Command.Input placeholder="Search categories..." />
                        <Command.Empty>No categories found.</Command.Empty>

                        <Command.Group>
                          {['YouTube'].map((category) => (
                            <Command.Item
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
                                    : 'opacity-0',
                                )}
                              />
                              {category}
                            </Command.Item>
                          ))}
                        </Command.Group>
                      </Command>
                    </Popover.Content>
                  </Popover>
                </Form.Item>
              )}
            />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Choose your technical values</Card.Title>
          </Card.Header>

          <Card.Content className="flex flex-col gap-6">
            <Form.Field
              control={detailsForm.control}
              name="valueVerb"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Unit Verb</Form.Label>
                    <Form.Description>
                      Appears before the value, describes how the value relates
                      to the noun, such as &apos;costs&apos; or &apos;has&apos;.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="valueNoun"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Unit Noun</Form.Label>
                    <Form.Description>
                      The unit that the values are, such as &apos;views&apos; or
                      &apos;people&apos;.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="higherText"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Higher Synonym</Form.Label>
                    <Form.Description>
                      A synonym of higher that will appear in-game as the higher
                      button, for example, &apos;More&apos;, &apos;Better&apos;,
                      etc.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="lowerText"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">Lower Synonym</Form.Label>
                    <Form.Description>
                      A synonym of lower that will appear in-game as the lower
                      button, for example, &apos;Less&apos;, &apos;Worse&apos;,
                      etc.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="valuePrefix"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">
                      Value Prefix (Optional)
                    </Form.Label>
                    <Form.Description>
                      Appears as a prefix to the value, for example a currency
                      symbol.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Form.Field
              control={detailsForm.control}
              name="valueSuffix"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-6 space-y-0 lg:flex-row">
                  <div className="lg:w-1/3">
                    <Form.Label className="block">
                      Value Suffix (Optional)
                    </Form.Label>
                    <Form.Description>
                      Appears as a suffix to the value, for example weight or
                      speed units. Can be empty.
                    </Form.Description>
                  </div>

                  <div className="flex-grow">
                    <Form.Control>
                      <Input type="text" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            <Button type="submit" className="ml-auto">
              Create
            </Button>
          </Card.Content>
        </Card>
      </form>
    </Form>
  );
}
