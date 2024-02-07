import { z } from "zod";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscription = await db.subscription.findUnique({
      where: {
        userId_subredditId: {
          userId: session.user.id,
          subredditId,
        },
      },
      include: {
        subreddit: true,
      },
    });

    if (subscription === null) {
      throw new Response("You are not subscribed to this subreddit.", {
        status: 400,
      });
    }

    if (subscription.subreddit.creatorId === session.user.id) {
      throw new Response("You can't unsubscribe from your own subreddit.", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          userId: session.user.id,
          subredditId,
        },
      },
    });

    return new Response(subredditId);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    }
    return new Response("Could not unsubscribe, please try again", {
      status: 500,
    });
  }
}
