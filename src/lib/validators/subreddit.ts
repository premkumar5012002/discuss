import { z } from "zod";

export const SubredditValidator = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(21, "Name should not exceed more than 21 characters")
    .regex(
      new RegExp("^[a-zA-Z0-9_]*$"),
      'No special characters are allowed except underscore ("_")',
    )
    .refine((s) => s.includes(" ") === false, "Spaces are not allowed!"),
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string().cuid(),
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;

export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
