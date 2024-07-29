'use server';

import * as z from 'zod';
import { cookies } from 'next/headers';

import { loginUser, lucia } from '~/lib/auth';

import { loginSchema } from './schema';

export async function login(values: z.infer<typeof loginSchema>) {
  try {
    const { success, data } = loginSchema.safeParse(values);
    if (!success) throw new Error('Invalid form data');

    const { username: email, password } = data;

    const user = await loginUser(email, password);
    if (!user) return { error: 'Invalid username or password' };

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);

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
