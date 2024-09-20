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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { deleteTag } from './actions';
import { deleteTagSchema } from './schema';

export default function DeleteTag({ tags }: { tags: { all: string[]; selected: string[] } }) {
  const [isOpen, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof deleteTagSchema>>({
    resolver: zodResolver(deleteTagSchema),
    mode: 'onChange',
    disabled: isPending,
    defaultValues: {
      name: '',
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

  function onSubmit(values: z.infer<typeof deleteTagSchema>) {
    startTransition(() => {
      setError(null);
      deleteTag(values).then((result) => {
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
          variant="ghost"
          className="h-7 px-5 text-xs"
          disabled={tags.all.length === 0}
        >
          Delete a Tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
          <DialogDescription>Delete a tag from your library.</DialogDescription>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tags.all.map((tag) => (
                        <SelectItem
                          key={tag}
                          value={tag}
                        >
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full flex-row-reverse items-center gap-3">
              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.disabled}
              >
                Delete Tag
              </Button>
              <Button
                variant="secondary"
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
