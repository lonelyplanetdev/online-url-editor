import { z } from 'zod';

export const manageSchema = z
  .object({
    old_password: z.string().min(1, { message: 'Old password is required' }),
    new_password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password must be at most 100 characters' })
      .regex(/^.*(?=.*[a-zA-Z])(?=.*\d).*$/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter and one number',
      }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
  })
  .refine((data) => data.old_password !== data.new_password, {
    message: 'New password must be different from old password',
  });
