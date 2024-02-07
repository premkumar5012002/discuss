import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { title, content, subredditId } = PostValidator.parse(body);

    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
      include: {
        subreddit: true,
      },
    });

    if (subscription === null) {
      return new Response("Subscribe to post", { status: 403 });
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session.user.id,
      },
    });

    revalidatePath(`/r/${subscription.subreddit.name}`);

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
