"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button } from "@nextui-org/react";
import { FC, useMemo, useRef, useState } from "react";
import { Comment, CommentVote, User } from "@prisma/client";

import {
  IconLoader2,
  IconMessage,
  IconMessageShare,
} from "@tabler/icons-react";

import { getRelativeTime } from "@/lib/utils";

import { CommentVotes } from "./comment-votes";
import { CreateComment } from "./create-comment";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User | null;
  _count: {
    replies: number;
  };
};

export const PostComment: FC<{
  userId?: string;
  comment: ExtendedComment;
}> = ({ userId, comment }) => {
  const router = useRouter();

  const [isReplying, setIsReplying] = useState(false);

  const [showReplies, setShowReplies] = useState(false);

  const { data: replies, isPending } = useQuery({
    enabled: showReplies,
    queryKey: ["replies", comment.id],
    queryFn: async () => {
      const { data } = await axios.get<ExtendedComment[]>(
        `/api/subreddit/post/comment?replyToId=${comment.id}`,
      );
      return data;
    },
  });

  const votesLength = useMemo(
    () =>
      comment.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0),
    [comment.votes],
  );

  const userCommentVote = useMemo(
    () => comment.votes.find((vote) => vote.userId === userId),
    [comment.votes, userId],
  );

  return (
    <div className="flex flex-col overflow-auto">
      <div className="flex gap-3">
        <div className="relative">
          <Avatar
            size="sm"
            showFallback
            src={comment.author?.image ?? undefined}
          />
          <div className="absolute bottom-0 left-4 top-9 w-px bg-divider"></div>
        </div>

        <div className="w-full space-y-1">
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-medium text-default-700">
              u/{comment.author?.username ?? "User deleted"}
            </p>
            <p className="max-h-40 truncate text-xs text-default-500">
              {getRelativeTime(comment.createdAt)}
            </p>
          </div>
          <p className="text-sm text-default-700">{comment.comment}</p>

          <div className="flex items-center gap-2">
            <CommentVotes
              commentId={comment.id}
              initialVotesLength={votesLength}
              initialUserVoteType={userCommentVote?.type}
            />

            <div>
              <Button
                variant="light"
                isDisabled={comment._count.replies <= 0}
                startContent={<IconMessage size={18} />}
                onClick={() => setShowReplies((prev) => !prev)}
              >
                {`${comment._count.replies} Replies`}
              </Button>
            </div>

            <div>
              <Button
                variant="light"
                startContent={<IconMessageShare size={18} />}
                onClick={() => {
                  if (userId) {
                    setIsReplying(true);
                  } else {
                    router.push("/sign-in");
                  }
                }}
              >
                Reply
              </Button>
            </div>
          </div>

          {isReplying ? (
            <CreateComment
              postId={comment.postId}
              replyToId={comment.id}
              onHideCreateComment={() => {
                setShowReplies(true);
                setIsReplying(false);
              }}
            />
          ) : null}

          {showReplies ? (
            <CommentReplies
              userId={userId}
              replies={replies}
              isPending={isPending}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const CommentReplies: FC<{
  userId?: string;
  isPending: boolean;
  replies?: ExtendedComment[];
}> = ({ userId, isPending, replies }) => {
  if (isPending) {
    return <IconLoader2 className="animate-spin" size={18} />;
  }

  return (
    <div className="space-y-3">
      {replies?.map((comment) => (
        <PostComment key={comment.id} comment={comment} userId={userId} />
      ))}
    </div>
  );
};
