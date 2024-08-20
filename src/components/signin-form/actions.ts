'use server';

import * as z from 'zod';
import { cookies } from 'next/headers';

import { signinUser, lucia } from '~/lib/auth';

import { signinSchema } from './schema';

export async function signin(values: z.infer<typeof signinSchema>) {
  try {
    const { success, data } = signinSchema.safeParse(values);
    if (!success) throw new Error('Invalid form data');

    const { username: email, password } = data;

    const user = await signinUser(email, password);
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
