import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ManageForm } from '~/components/manage-form';
import { ModeToggle } from '~/components/mode-toggle';
import { validateRequest } from '~/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export default async function AuthSignoutPage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Account</CardTitle>
        </CardHeader>
        <CardContent>
          <ManageForm />
        </CardContent>
      </Card>
      <div className="mt-4 flex w-full max-w-64 justify-evenly">
        <ModeToggle />
        <Button
          variant="link"
          className="w-full grow basis-1/3 text-xs"
          size="sm"
          asChild
        >
          <Link href="/">Home</Link>
        </Button>
        <Button
          variant="link"
          className="w-full grow basis-1/3 text-xs"
          size="sm"
          asChild
        >
          <Link href="/auth/signout">Signout</Link>
        </Button>
      </div>
    </main>
  );
}
