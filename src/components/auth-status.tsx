import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { validateRequest } from '~/lib/auth';

export async function AuthStatus() {
  const { user } = await validateRequest();

  const link = user ? '/auth/logout' : '/auth/login';
  const text = user ? 'Log Out' : 'Log In';

  return (
    <Button
      variant="outline"
      className="w-full"
      asChild
    >
      <Link href={link}>{text}</Link>
    </Button>
  );
}
