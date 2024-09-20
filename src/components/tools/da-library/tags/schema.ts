import * as z from 'zod';

export const createNewTagSchema = z.object({
  name: z
    .string()
    .toLowerCase()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .min(1)
    .max(32),
});

export const updateTagSchema = z.object({
  oldName: z.string().min(1),
  newName: z
    .string()
    .toLowerCase()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .min(1)
    .max(32),
});

export const deleteTagSchema = z.object({
  name: z.string().min(1),
});
