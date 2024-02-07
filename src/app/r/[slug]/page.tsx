import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import { MiniCreatePost } from "@/components/subreddit/mini-create-post";
import { PostFeed } from "@/components/subreddit/post-feed";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const session = await getAuthSession();

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: slug,
      },
    },
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <h1 className="h-12 text-3xl font-bold md:text-4xl">r/{slug}</h1>
      <MiniCreatePost session={session} />
      <PostFeed
        initialPosts={posts}
        subredditName={slug}
        userId={session?.user.id}
      />
    </>
  );
}
