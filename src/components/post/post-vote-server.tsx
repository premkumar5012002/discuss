import { Post, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import { FC } from "react";

import { getAuthSession } from "@/lib/auth";

import { PostVoteClient } from "./post-vote-client";

export const PostVoteServer: FC<{
  postId: string;
  getData: () => Promise<(Post & { votes: Vote[] }) | null>;
}> = async ({ postId, getData }) => {
  const session = await getAuthSession();

  const post = await getData();

  if (post === null) {
    return notFound();
  }

  const votesLength = post.votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1;
    if (vote.type === "DOWN") return acc - 1;
    return acc;
  }, 0);

  const userVoteType = post.votes.find(
    (vote) => vote.userId === session?.user.id,
  )?.type;

  return (
    <PostVoteClient
      postId={postId}
      initialVotesLength={votesLength}
      initialUserVoteType={userVoteType}
    />
  );
};
