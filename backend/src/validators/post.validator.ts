import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(150, 'Title cannot exceed 150 characters'),
  content: z
    .string({ required_error: 'Content is required' })
    .trim()
    .min(10, 'Content must be at least 10 characters long'),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(150, 'Title cannot exceed 150 characters')
    .optional(),
  content: z
    .string()
    .trim()
    .min(10, 'Content must be at least 10 characters long')
    .optional(),
}).refine((data) => data.title !== undefined || data.content !== undefined, {
  message: 'At least one field (title or content) must be provided to update',
});

export const queryPostSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(6),
  search: z.string().optional(),
  author: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type QueryPostInput = z.infer<typeof queryPostSchema>;
