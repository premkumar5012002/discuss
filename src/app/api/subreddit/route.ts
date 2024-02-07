import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name } = SubredditValidator.parse(body);

    const subredditExists = await db.subreddit.findUnique({
      where: {
        name: name,
      },
    });

    if (subredditExists) {
      return new Response("Subreddit already exists.", { status: 409 });
    }

    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    }
    return new Response("Could not create subreddit", { status: 500 });
  }
}
