'use server';

import { lucia, validateRequest } from '~/lib/auth';
import { cookies } from 'next/headers';

export async function logout() {
  try {
    const { session } = await validateRequest();
    if (!session) return { success: true };

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Internal Server Error' };
  }
}
