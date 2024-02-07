import { FC } from "react";
import { Card, Divider } from "@nextui-org/react";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

import { PostComment } from "./post-comment";
import { CreateComment } from "./create-comment";

export const CommentsSection: FC<{ postId: string }> = async ({ postId }) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      votes: true,
      author: true,
      _count: {
        select: { replies: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Card className="flex flex-col gap-y-4 p-6">
      <CreateComment postId={postId} />

      <Divider className="my-6" />

      {comments.length === 0 && (
        <p className="text-center text-default-500">No comments available...</p>
      )}

      <div className="flex flex-col gap-y-6">
        {comments.map((comment) => (
          <PostComment
            key={comment.id}
            comment={comment}
            userId={session?.user.id}
          />
        ))}
      </div>
    </Card>
  );
};
