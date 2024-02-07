import { FC } from "react";
import { Session } from "next-auth";

import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import { PostFeed } from "../subreddit/post-feed";

export const CustomFeed: FC<{ session: Session }> = async ({ session }) => {
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      subreddit: {
        select: {
          id: true,
        },
      },
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        id: {
          in: followedCommunities.flatMap(({ subreddit }) => subreddit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed userId={session.user.id} initialPosts={posts} />;
};
