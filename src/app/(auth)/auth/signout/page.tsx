import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { SignoutForm } from '~/components/signout-form';
import { ModeToggle } from '~/components/mode-toggle';

export default async function AuthSignoutPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Signout</CardTitle>
        </CardHeader>
        <CardContent>
          <SignoutForm successRedirect="/auth/signin" />
        </CardContent>
      </Card>
      <ModeToggle excuseFlex />
    </main>
  );
}
