import * as React from 'react';
import * as z from 'zod';
import { Lucia } from 'lucia';
import type { Session, User } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { cookies } from 'next/headers';
import { db } from './db';
import { hash, verify } from '@node-rs/argon2';

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      superuser: attributes.superuser,
      username: attributes.username,
    };
  },
});

export const validateRequest = React.cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export const signinUser = async (username: string, password: string) => {
  const user = await db.user.findFirst({
    where: {
      username,
    },
  });
  if (!user) return null;

  const valid = await verify(user.password, password);
  if (!valid) return null;

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .refine((value) => /[a-z]/.test(value), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((value) => /[A-Z]/.test(value), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((value) => /.*[0-9].*/.test(value), {
    message: 'Password must contain at least one number',
  })
  .refine(
    (value) => /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value),
    { message: 'Password must contain at least one special character' },
  );

export const validPassword = async (password: string) => {
  try {
    passwordSchema.parse(password);
    return true;
  } catch {
    return false;
  }
};

export const hashPassword = async (password: string) => {
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return passwordHash;
};

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  superuser: boolean;
}
