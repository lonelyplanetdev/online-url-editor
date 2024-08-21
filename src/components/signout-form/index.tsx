'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Alert, AlertDescription } from '~/components/ui/alert';

import { signout } from './actions';

interface SignoutFormProps {
  successRedirect: string;
}
export function SignoutForm({ successRedirect }: SignoutFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const router = useRouter();

  const onSubmit = React.useCallback(() => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      signout().then((result) => {
        if (result.error) return setError(result.error);
        setError(null);
        setSuccess('Signout successful, redirecting...');
        setTimeout(() => {
          router.push(successRedirect);
        }, 500);
      });
    });
  }, [router, startTransition, successRedirect]);

  React.useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <form
      action={onSubmit}
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
            <CheckCircle className="h-4 w-4" />
            <span>{success}</span>
          </AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={pending || !!success}
      >
        {success ? 'Logging out...' : pending ? 'Logging out...' : 'Signout'}
      </Button>
    </form>
  );
}
