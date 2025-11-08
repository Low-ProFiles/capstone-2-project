import * as z from "zod";


export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  spots: z.array(z.object({
    orderNo: z.number(),
    title: z.string().min(1, "Spot title is required"),
    description: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
  })).min(1, "At least one spot is required"),
});

export type CourseFormValues = z.infer<typeof formSchema>;

export const profileEditSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
});

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;