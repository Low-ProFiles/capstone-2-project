import * as z from 'zod';

export const courseFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  categoryId: z.string().min(1, 'Category is required'),
  coverImageUrl: z.string().url('Invalid URL').min(1, 'Cover image is required'),
  regionCode: z.string().min(1, 'Region is required'),
  regionName: z.string().min(1, 'Region is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  spots: z
    .array(
      z.object({
        orderNo: z.coerce.number().int(),
        title: z.string().min(1, 'Spot title is required'),
        description: z.string(),
        lat: z.coerce.number(),
        lng: z.coerce.number(),
        images: z.array(z.string().url()),
        stayMinutes: z.coerce.number().int().positive('Stay minutes must be positive'),
        price: z.coerce.number().int().positive('Price must be positive'),
      }),
    )
    .min(1, 'At least one spot is required'),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export const profileEditSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  bio: z.string().optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
});

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;