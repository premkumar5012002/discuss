import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const { replyToId } = z
      .object({
        replyToId: z.string().cuid(),
      })
      .parse({
        replyToId: url.searchParams.get("replyToId"),
      });

    const comments = await db.comment.findMany({
      where: {
        replyToId,
      },
      include: {
        author: true,
        votes: true,
        _count: {
          select: { replies: true },
        },
      },
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
    });

    return new Response(JSON.stringify(comments));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    }
    return new Response("Could not create comment, please try again", {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { postId, comment, replyToId } = CommentValidator.parse(body);

    await db.comment.create({
      data: {
        comment,
        postId,
        replyToId,
        authorId: session.user.id,
      },
    });

    return new Response("OK");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    }
    return new Response("Could not create comment, please try again", {
      status: 500,
    });
  }
}
