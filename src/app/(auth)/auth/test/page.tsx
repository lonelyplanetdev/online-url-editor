import { hashPassword } from '~/lib/auth';
import { db } from '~/lib/db';

export default async function AuthLoginPage() {
  const passwordHash = await hashPassword('mYaDmInPaSsWoRd123!');

  const user = await db.user.upsert({
    where: {
      username: 'admin',
    },
    create: {
      username: 'admin',
      password: passwordHash,
    },
    update: {},
  });

  return <main className="flex h-screen items-center justify-center">s</main>;
}
