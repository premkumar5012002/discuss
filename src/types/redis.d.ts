import { VoteType } from "~/prisma/generated/client";

export type CachedPost = {
  id: string;
  title: string;
  content: string | null;
  userVote: VoteType | null;
  authorUsername: string | null;
  createdAt: Date;
};
