'use client';

import * as z from 'zod';
import * as React from 'react';

import { AlertCircle } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Alert, AlertDescription } from '~/components/ui/alert';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { manageSchema } from './schema';

import { manage } from './actions';
import { useRouter } from 'next/navigation';

export function ManageForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [proccessing, startTransition] = React.useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof manageSchema>>({
    resolver: zodResolver(manageSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  function onSubmit(values: z.infer<typeof manageSchema>) {
    startTransition(() => {
      setError(null);
      setSuccess(null);
      manage(values).then((result) => {
        if (result.unauthed) {
          setError('Unauthorized');
          router.push('/auth/signin');
          return;
        }
        if (result.success) {
          setSuccess('Password changed successfully');
          form.reset();
        } else {
          setError(result.error ?? 'An error occurred');
        }
      });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {error && (
          <Alert
            variant="destructive"
            className="p-4"
          >
            <AlertDescription className="flex flex-row items-center justify-start gap-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert
            variant="success"
            className="p-4"
          >
            <AlertDescription className="flex flex-row items-center justify-start gap-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{success}</span>
            </AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="old_password"
          disabled={proccessing}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="old password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          disabled={proccessing}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          disabled={proccessing}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={proccessing}
        >
          Update Account
        </Button>
      </form>
    </Form>
  );
}
