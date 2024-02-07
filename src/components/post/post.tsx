import { FC, useRef } from "react";
import Link from "next/link";
import { Vote } from "@prisma/client";
import { Card } from "@nextui-org/react";
import {
  IconDots,
  IconMessage2,
  IconPoint,
  IconPointFilled,
} from "@tabler/icons-react";

import { ExtendedPost } from "@/types/db";
import { getRelativeTime } from "@/lib/utils";

import { PostViewer } from "./post-viewer";
import { PostVoteClient } from "./post-vote-client";

type PartialVote = Pick<Vote, "type">;

export const Post: FC<{
  subredditName: string;
  post: ExtendedPost;
  votesLength: number;
  commentsLength: number;
  userVote?: PartialVote;
}> = ({ subredditName, post, votesLength, commentsLength, userVote }) => {
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <div className="flex justify-between px-3 py-4 md:px-6">
        <PostVoteClient
          postId={post.id}
          initialVotesLength={votesLength}
          initialUserVoteType={userVote?.type}
        />

        <div className="flex-1">
          <div className="mt-1 flex flex-col items-start gap-2 text-xs text-default-500 md:flex-row md:items-center">
            <Link
              className="text-sm text-default-700 underline underline-offset-2"
              href={`/r/${subredditName}`}
            >
              r/{subredditName}
            </Link>

            <span className="hidden md:block">
              <IconPointFilled size={12} />
            </span>

            <div className="flex items-center gap-2.5">
              <span>Posted by u/{post.author.username}</span>
              <span>{getRelativeTime(post.createdAt)}</span>
            </div>
          </div>

          <Link href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-default-700">
              {post.title}
            </h1>
          </Link>

          <div
            ref={postContentRef}
            className="relative max-h-40 w-full overflow-clip text-sm"
          >
            {post.content && <PostViewer content={JSON.parse(post.content)} />}

            {/* blur bottom if content is too long */}
            {postContentRef.current?.clientHeight === 160 && (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-default-50 to-transparent" />
            )}
          </div>
        </div>
      </div>

      <div className="z-20 bg-default-100 px-4 py-4 text-sm sm:px-6">
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <IconMessage2 size={20} /> {commentsLength} comments
        </Link>
      </div>
    </Card>
  );
};
