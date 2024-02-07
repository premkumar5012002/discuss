import { notFound } from "next/navigation";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";

import { db } from "@/lib/db";

import { PostEditor } from "@/components/post/post-editor";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const subreddit = await db.subreddit.findUnique({
    where: {
      name: slug,
    },
  });

  if (subreddit === null) {
    throw notFound();
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full border-b border-divider pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-xl font-semibold leading-6 text-default-700">
            Create a Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-default-500">
            in r/${slug}
          </p>
        </div>
      </div>
      {/* Form */}
      <Card fullWidth className="px-8 py-6">
        <PostEditor subredditId={subreddit.id} subredditName={subreddit.name} />
      </Card>
    </div>
  );
}
