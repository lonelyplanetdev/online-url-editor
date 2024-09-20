'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { validateRequest } from '~/lib/auth';
import { db } from '~/lib/db';
import { MAX_TAGS } from '../constants';
import { createNewTagSchema, deleteTagSchema, updateTagSchema } from './schema';

export const createTag = async (values: z.infer<typeof createNewTagSchema>) => {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  try {
    const tags = await db.dALibraryTag.findMany();
    if (tags.length >= MAX_TAGS) return { error: 'Max tags reached' };

    const { name } = createNewTagSchema.parse(values);

    await db.dALibraryTag.create({
      data: {
        name,
      },
    });

    revalidatePath('/tools/da-library');

    return { error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Tag name already in use' };
    }
    if (error instanceof z.ZodError) {
      return { error: 'Form Schema Error' };
    }

    return { error: 'Failed to create tag' };
  }
};

export const updateTag = async (values: z.infer<typeof updateTagSchema>) => {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  try {
    const { oldName, newName } = updateTagSchema.parse(values);

    await db.dALibraryTag.update({
      where: {
        name: oldName,
      },
      data: {
        name: newName,
      },
    });

    revalidatePath('/tools/da-library');

    return { error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Tag name already in use' };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return { error: 'Tag not found' };
    }
    if (error instanceof z.ZodError) {
      return { error: 'Form Schema Error' };
    }

    return { error: 'Failed to update tag' };
  }
};

export const deleteTag = async (values: z.infer<typeof deleteTagSchema>) => {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  try {
    const { name } = deleteTagSchema.parse(values);

    await db.dALibraryTag.delete({
      where: {
        name,
      },
    });

    revalidatePath('/tools/da-library');

    return { error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return { error: 'Tag not found' };
    }
    if (error instanceof z.ZodError) {
      return { error: 'Form Schema Error' };
    }

    return { error: 'Failed to delete tag' };
  }
};
