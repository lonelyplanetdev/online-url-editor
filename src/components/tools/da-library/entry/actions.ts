'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { validateRequest } from '~/lib/auth';
import { db } from '~/lib/db';
import { MAX_TAGS } from '../constants';
import { createTemplateSchema, deleteTemplateIdSchema } from './schema';

export const createTemplate = async (values: z.infer<typeof createTemplateSchema>) => {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  try {
    const tags = await db.dALibraryTag.findMany();
    if (tags.length >= MAX_TAGS) return { error: 'Max tags reached' };

    const validatedValues = createTemplateSchema.parse(values);

    const validTags = await db.dALibraryTag
      .findMany({
        where: {
          name: {
            in: validatedValues.tags,
          },
        },
      })
      .then((tags) => tags.length === validatedValues.tags.length);

    if (!validTags) return { error: 'Invalid tags' };

    await db.dALibraryItem.create({
      data: {
        id: validatedValues.id,
        description: validatedValues.description,
        tags: {
          connect: validatedValues.tags.map((name) => ({ name })),
        },
        imageUrls: validatedValues.imageUrls
          .map((url) => url.trim())
          .filter(Boolean)
          .filter((url) => {
            try {
              const urlInstance = new URL(url);
              if (!['http:', 'https:'].includes(urlInstance.protocol)) return false;
              return true;
            } catch {
              return false;
            }
          })
          .slice(0, 4),
      },
    });

    revalidatePath('/tools/da-library');

    return { error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Template ID already exists' };
    }
    if (error instanceof z.ZodError) {
      return { error: 'Form Schema Error' };
    }

    return { error: 'Failed to create tag' };
  }
};

export const updateTemplate = async (values: z.infer<typeof createTemplateSchema>) => {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  try {
    // Parse and validate the input values using Zod
    const validatedValues = createTemplateSchema.parse(values);

    // Check if the template with the given ID exists
    const existingTemplate = await db.dALibraryItem.findUnique({
      where: { id: validatedValues.id },
    });

    if (!existingTemplate) {
      return { error: 'Template not found' };
    }

    // Validate that the provided tags exist in the database
    const validTags = await db.dALibraryTag.findMany({
      where: {
        name: {
          in: validatedValues.tags,
        },
      },
    });

    if (validTags.length !== validatedValues.tags.length) {
      return { error: 'One or more tags are invalid' };
    }

    // Clean and validate image URLs
    const validImageUrls = validatedValues.imageUrls
      .map((url) => url.trim())
      .filter(Boolean)
      .slice(0, 4); // Limit to 4 URLs

    // Update the template in the database
    await db.dALibraryItem.update({
      where: { id: validatedValues.id },
      data: {
        description: validatedValues.description,
        tags: {
          // Disconnect all existing tags and connect the new ones
          set: validatedValues.tags.map((name) => ({ name })),
        },
        imageUrls: validImageUrls,
      },
    });

    // Revalidate the cache for the relevant path
    revalidatePath('/tools/da-library');

    return { error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors if necessary
      return { error: 'Database error occurred' };
    }
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return { error: 'Form validation error' };
    }

    // Catch-all for other errors
    return { error: 'Failed to update template' };
  }
};

export const deleteTemplate = async (id: string) => {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  const validatedId = deleteTemplateIdSchema.parse(id);

  try {
    // Check if the template with the given ID exists
    const existingTemplate = await db.dALibraryItem.findUnique({
      where: { id: validatedId },
    });

    if (!existingTemplate) {
      return { error: 'Template not found' };
    }

    // Delete the template from the database
    await db.dALibraryItem.delete({
      where: { id: validatedId },
    });

    // Revalidate the cache for the relevant path
    revalidatePath('/tools/da-library');

    return { error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors if necessary
      return { error: 'Database error occurred' };
    }

    // Catch-all for other errors
    return { error: 'Failed to delete template' };
  }
};
