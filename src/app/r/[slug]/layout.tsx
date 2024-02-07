import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card } from "@nextui-org/react";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

import { ToggleSubscription } from "@/components/subreddit/toggle-subscription";

export default async function Layout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findUnique({
    where: {
      name: slug,
    },
  });

  if (subreddit === null) {
    return notFound();
  }

  let isSubscribed = false;

  if (session) {
    const subscription = await db.subscription.findUnique({
      where: {
        userId_subredditId: {
          userId: session.user.id,
          subredditId: subreddit.id,
        },
      },
    });

    if (subscription) {
      isSubscribed = true;
    }
  }

  const subredditMembersCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="mx-auto h-full max-w-7xl">
      <div>
        <div className="grid grid-cols-1 gap-y-4 md:gap-x-4 lg:grid-cols-3">
          <div className="col-span-2 flex flex-col space-y-6 py-6">
            {children}
          </div>

          {/* Subreddit Info */}
          <Card className="order-first h-fit overflow-hidden lg:order-last">
            <div className="border-b border-divider px-6 py-2">
              <p className="py-3 text-lg font-semibold">
                About r/{subreddit.name}
              </p>
            </div>

            <dl className="divide-y divide-divider px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-default-700">Created</dt>
                <dd className="text-default-500">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {subreddit.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-default-700">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-default-500">
                    {subredditMembersCount}
                  </div>
                </dd>
              </div>

              <div className="space-y-2 py-2">
                {subreddit.creatorId === session?.user.id ? (
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-default-700">
                      You created this community
                    </dt>
                  </div>
                ) : (
                  <ToggleSubscription
                    subredditId={subreddit.id}
                    subredditName={subreddit.name}
                    isSubscribed={isSubscribed}
                  />
                )}

                {isSubscribed && (
                  <Button
                    fullWidth
                    as={Link}
                    color="secondary"
                    href={`/r/${subreddit.name}/submit`}
                  >
                    Create Post
                  </Button>
                )}
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
