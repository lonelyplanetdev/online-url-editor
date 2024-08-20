import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninForm } from '~/components/signin-form';
import { ModeToggle } from '~/components/mode-toggle';

export default function AuthSigninPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Signin</CardTitle>
        </CardHeader>
        <CardContent>
          <SigninForm successRedirect="/" />
        </CardContent>
      </Card>
      <ModeToggle excuseFlex />
    </main>
  );
}
