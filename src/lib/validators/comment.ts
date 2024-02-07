import { z } from "zod";

export const CommentValidator = z.object({
  postId: z.string(),
  comment: z.string(),
  replyToId: z.string().cuid().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;
