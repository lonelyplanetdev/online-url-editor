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
import { Input } from '~/components/ui/input';
import { createTag } from './actions';
import { createNewTagSchema } from './schema';

export default function CreateTag() {
  const [isOpen, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof createNewTagSchema>>({
    resolver: zodResolver(createNewTagSchema),
    mode: 'onBlur',
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

  function onSubmit(values: z.infer<typeof createNewTagSchema>) {
    startTransition(() => {
      setError(null);
      createTag(values).then((result) => {
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
        >
          Create Tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tag Name"
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .replace(/\s/g, '-')
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ''),
                        )
                      }
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
                Create Tag
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
