import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, "Title for the post must be atleast 3 characters")
    .max(128, "Title for the post cannot exceed more than 128 characters"),
  subredditId: z.string().cuid(),
  content: z.string().optional(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
