import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { PostVoteValidator } from "@/lib/validators/vote";
import { db } from "@/lib/db";
import { CachedPost } from "@/types/redis";
import { redis } from "@/lib/redis";
import { Post, User, Vote, VoteType } from "@prisma/client";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const existingVote = await db.vote.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (post === null) {
      throw new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
      } else {
        await db.vote.update({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
      }

      // Cache the post if upvote reaches after certain limit for faster results
      await cachePost(voteType, post);

      return new Response("OK");
    }

    await db.vote.create({
      data: {
        postId,
        type: voteType,
        userId: session.user.id,
      },
    });

    // Cache the post if upvote reaches after certain limit for faster results
    await cachePost(voteType, post);

    return new Response("OK");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    }
    return new Response(
      "Could not post to subreddit at this time. Please try later",
      { status: 500 },
    );
  }
}

const cachePost = async (
  voteType: VoteType,
  post: Post & { author: User; votes: Vote[] },
) => {
  const votesLength = post.votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1;
    if (vote.type === "DOWN") return acc - 1;
    return acc;
  }, 0);

  if (votesLength >= CACHE_AFTER_UPVOTES) {
    const cachePayload: CachedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      userVote: voteType,
      authorUsername: post.author.username,
      createdAt: post.createdAt,
    };

    await redis.hset(`post:${post.id}`, cachePayload);
  }
};
