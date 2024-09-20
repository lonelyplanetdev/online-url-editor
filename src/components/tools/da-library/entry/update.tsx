'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pen } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
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
import { updateTemplate } from './actions';
import DeleteButton from './delete-button';
import { createTemplateSchema } from './schema'; // Use the appropriate schema

type TemplateType = {
  id: string;
  description: string | null;
  tags: string[];
  imageUrls: string[];
};

export default function UpdateTemplate({
  template,
  tags,
}: {
  template: TemplateType;
  tags: { all: string[]; selected: string[] };
}) {
  const [pendingDelete, setPendingDelete] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const shouldBeDisabled = isPending || pendingDelete;

  const form = useForm<z.infer<typeof createTemplateSchema>>({
    resolver: zodResolver(createTemplateSchema),
    disabled: shouldBeDisabled,
    defaultValues: {
      id: '',
      description: '',
      tags: [],
      imageUrls: [],
    },
  });

  useEffect(() => {
    form.reset({
      id: template.id,
      description: template.description || '',
      tags: template.tags,
      imageUrls: template.imageUrls,
    });
  }, [form, template]);

  function onOpenChange(open: boolean) {
    if (shouldBeDisabled) return;
    if (!open) {
      form.reset();
      setError(null);
    }
    setOpen(open);
  }

  function onSubmit(values: z.infer<typeof createTemplateSchema>) {
    startTransition(() => {
      setError(null);
      updateTemplate(values).then((result) => {
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
          className="absolute right-0 top-1 size-5 opacity-0 transition-opacity group-hover:opacity-100"
          size="icon"
          variant="ghost"
        >
          <Pen size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Template</DialogTitle>
          <DialogDescription>Modify the details of your template.</DialogDescription>
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
            {/* Hidden input for ID */}
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="hidden"
                      {...field}
                    />
                  </FormControl>
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
                      defaultSelected={field.value}
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
                      defaults={field.value}
                      onChange={field.onChange}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <DeleteButton
                templateId={template.id}
                disabled={form.formState.disabled}
                onStarted={() => setPendingDelete(true)}
                onDeleted={() => {
                  setPendingDelete(false);
                  setOpen(false);
                  form.reset();
                }}
                onError={(error) => {
                  setPendingDelete(false);
                  setError(error);
                }}
              />
              <div className="flex w-full flex-row-reverse items-center gap-3">
                <Button
                  type="submit"
                  disabled={form.formState.disabled}
                >
                  Update
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
