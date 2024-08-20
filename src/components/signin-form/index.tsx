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
import { signinSchema } from './schema';

import { signin } from './actions';
import { useRouter } from 'next/navigation';

interface SigninFormProps {
  successRedirect: string;
}
export function SigninForm({ successRedirect }: SigninFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [proccessing, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof signinSchema>) {
    startTransition(() => {
      setError(null);
      signin(values).then((result) => {
        if (result.error) return setError(result.error);
        if (result.success) {
          router.push(successRedirect);
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
        <FormField
          control={form.control}
          name="username"
          disabled={proccessing}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          disabled={proccessing}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="password"
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
          Signin
        </Button>
      </form>
    </Form>
  );
}
