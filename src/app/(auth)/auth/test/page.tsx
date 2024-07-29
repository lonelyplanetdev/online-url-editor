import { db } from '~/lib/db';
import { hashPassword } from '~/lib/auth';

export default async function TestPage() {
  const ADMINUSER = {
    username: 'admin',
    password: 'admin',
  };

  const hashedPassword = await hashPassword(ADMINUSER.password);

  await db.user.upsert({
    where: { username: ADMINUSER.username },
    create: {
      username: ADMINUSER.username,
      password: hashedPassword,
    },
    update: {},
  });

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
}
