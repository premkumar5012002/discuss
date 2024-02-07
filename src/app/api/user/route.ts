import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/user";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { username } = UsernameValidator.parse(body);

    // check if username is taken
    const user = await db.user.findFirst({
      where: {
        username: username,
      },
    });

    if (user) {
      return new Response("Username is taken", { status: 409 });
    }

    // update username
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });

    return new Response("OK");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    return new Response(
      "Could not update username at this time. Please try later",
      { status: 500 },
    );
  }
}
