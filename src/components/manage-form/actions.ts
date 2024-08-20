'use server';

import * as z from 'zod';

import { hashPassword, validateRequest } from '~/lib/auth';

import { manageSchema } from './schema';
import { db } from '~/lib/db';

export async function manage(
  values: z.infer<typeof manageSchema>,
): Promise<{ success: boolean; error?: string; unauthed?: boolean }> {
  try {
    const authed = await validateRequest();
    if (!authed.user || !authed.session)
      return { success: false, error: 'Unauthorized', unauthed: true };

    const { success, data } = manageSchema.safeParse(values);
    if (!success) throw new Error('Invalid form data');

    const { new_password } = values;

    const user = await db.user.findUnique({
      where: { id: authed.user.id },
    });

    if (!user) throw new Error('User not found');

    const hash_password = await hashPassword(new_password);

    await db.user.update({
      where: { id: user.id },
      data: { password: hash_password },
    });

    return { success: true };
  } catch (error) {
    console.error(error);

    return { success: false, error: 'An error occurred' };
  }
}
