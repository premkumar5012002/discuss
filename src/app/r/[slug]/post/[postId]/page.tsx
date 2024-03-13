import { FC, Suspense } from "react";
import { notFound } from "next/navigation";
import { Post, User } from "~/prisma/generated/client";
import { Button, Card, Divider, Link, Skeleton } from "@nextui-org/react";

import {
  IconLoader2,
  IconArrowBigUp,
  IconPointFilled,
  IconArrowBigDown,
} from "@tabler/icons-react";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getRelativeTime } from "@/lib/utils";

import { PostViewer } from "@/components/post/post-viewer";
import { PostVoteServer } from "@/components/post/post-vote-server";
import { CommentsSection } from "@/components/comment/comments-section";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Page({
  params,
}: {
  params: { slug: string; postId: string };
}) {
  const cachedPost = await redis.hgetall(`post:${params.postId}`);

  const isCachedPostExists = Object.keys(cachedPost).length > 0;

  let post: (Post & { author: User }) | null = null;

  if (isCachedPostExists === false) {
    post = await db.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        author: true,
      },
    });
  }

  if (isCachedPostExists === false && post === null) {
    return notFound();
  }

  return (
    <div className="space-y-6 pb-6">
      <Card className="flex flex-col items-center justify-between py-3 sm:flex-row sm:items-start md:p-6">
        <div className="flex items-start">
          <Suspense fallback={<PostVoteShell />}>
            <PostVoteServer
              postId={params.postId}
              getData={async () => {
                return db.post.findUnique({
                  where: {
                    id: params.postId,
                  },
                  include: {
                    votes: true,
                  },
                });
              }}
            />
          </Suspense>

          <div>
            <div className="mt-1 flex flex-col items-start gap-2 text-xs text-default-500 md:flex-row md:items-center">
              <Link
                className="text-sm text-default-700 underline underline-offset-2"
                href={`/r/${params.slug}`}
              >
                r/{params.slug}
              </Link>

              <span className="hidden md:block">
                <IconPointFilled size={12} />
              </span>

              <div className="flex items-center gap-2.5">
                <span>
                  Posted by u/
                  {cachedPost?.authorUsername ?? post!.author.username}
                </span>
                <span>
                  {getRelativeTime(cachedPost?.createdAt ?? post!.createdAt)}
                </span>
              </div>
            </div>

            <div>
              <h2 className="py-2 text-xl font-semibold leading-6">
                {cachedPost?.title ?? post!.title}
              </h2>

              {(cachedPost?.content || post!.content) && (
                <PostViewer
                  content={JSON.parse(cachedPost?.content ?? post!.content)}
                />
              )}
            </div>
          </div>
        </div>
      </Card>

      <Suspense fallback={<CommentSectionShell />}>
        <CommentsSection postId={params.postId} />
      </Suspense>
    </div>
  );
}

const PostVoteShell: FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-0 sm:pb-0">
      <Button size="sm" isIconOnly variant="light" aria-label="upvote">
        <IconArrowBigUp size={18} />
      </Button>

      <div className="py-2 text-center text-sm font-medium text-default-500">
        <IconLoader2 className="animate-spin" size={18} />
      </div>

      <Button size="sm" isIconOnly variant="light" aria-label="downvote">
        <IconArrowBigDown size={18} />
      </Button>
    </div>
  );
};

const CommentSectionShell: FC = () => {
  return (
    <Card className="p-6">
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>

      <div className="flex justify-end pt-3">
        <Skeleton className="w-20 rounded-lg">
          <div className="h-10 rounded-lg bg-default-300" />
        </Skeleton>
      </div>

      <Divider className="my-8" />

      <div className="space-y-4">
        <div className="flex w-full max-w-[300px] items-center gap-3">
          <div>
            <Skeleton className="flex h-12 w-12 rounded-full" />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>

        <div className="flex w-full max-w-[300px] items-center gap-3">
          <div>
            <Skeleton className="flex h-12 w-12 rounded-full" />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
};
