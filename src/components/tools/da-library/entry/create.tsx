'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { DynamicInputList } from '~/components/ui/dynamic-input-list';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { MultiSelect } from '~/components/ui/multi-select';
import { Textarea } from '~/components/ui/textarea';
import { createTemplate } from './actions';
import { createTemplateSchema } from './schema';

export default function CreateTemplate({ tags }: { tags: { all: string[]; selected: string[] } }) {
  const [isOpen, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof createTemplateSchema>>({
    resolver: zodResolver(createTemplateSchema),
    disabled: isPending,
    defaultValues: {
      id: '',
      description: '',
      tags: [],
      imageUrls: [],
    },
  });

  function onOpenChange(open: boolean) {
    if (isPending) return;
    if (!open) {
      form.reset();
      setError(null);
    }
    setOpen(open);
  }

  function onSubmit(values: z.infer<typeof createTemplateSchema>) {
    startTransition(() => {
      setError(null);
      createTemplate(values).then((result) => {
        if (result.error) {
          setError(result.error);
          return;
        }
        setOpen(false);
        form.reset();
      });
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
        >
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>Create a new tag for your library.</DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-md border border-destructive bg-destructive/25 p-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tag Name"
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Description"
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <MultiSelect
                      items={tags.all}
                      onChange={field.onChange}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs (Optional)</FormLabel>
                  <FormControl>
                    <DynamicInputList
                      onChange={field.onChange}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full flex-row-reverse items-center gap-3">
              <Button
                type="submit"
                disabled={form.formState.disabled}
              >
                Create Template
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setOpen(false)}
                disabled={form.formState.disabled}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
