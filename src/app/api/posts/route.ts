import { z } from "zod";
import { Prisma } from "@prisma/client";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
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

    followedCommunitiesIds = followedCommunities.flatMap(
      ({ subreddit }) => subreddit.id,
    );
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.coerce.number(),
        page: z.coerce.number(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get("subredditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let postWhereClause: Prisma.PostWhereInput = {};

    if (subredditName) {
      postWhereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session) {
      postWhereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: limit,
      skip: (page - 1) * limit, // skip should start from 0 for page 1
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: postWhereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (e) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}
