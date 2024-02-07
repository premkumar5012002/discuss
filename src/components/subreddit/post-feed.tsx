"use client";

import axios from "axios";
import { FC, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { ExtendedPost } from "@/types/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import { useIntersection } from "@/hooks/use-intersection";

import { Post } from "../post/post";

export const PostFeed: FC<{
  userId?: string;
  subredditName?: string;
  initialPosts: ExtendedPost[];
}> = ({ userId, initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts", subredditName],
    queryFn: async ({ pageParam = 1 }) => {
      let query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;

      if (subredditName) {
        query += `&subredditName=${subredditName}`;
      }

      const { data } = await axios.get<ExtendedPost[]>(query);

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (_, allPages) => allPages.length + 1,
    initialData: { pages: [initialPosts], pageParams: [1] },
  });

  const posts = data.pages.flatMap((page) => page);

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <ul className="col-span-2 flex flex-col space-y-6">
      {posts.map((post, i) => {
        const userVote = post.votes.find((vote) => vote.userId === userId);

        const votesLength = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") {
            return acc + 1;
          }
          if (vote.type === "DOWN") {
            return acc - 1;
          }
          return acc;
        }, 0);

        const commentsLength = post.comments.length;

        if (i === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                subredditName={post.subreddit.name}
                userVote={userVote}
                votesLength={votesLength}
                commentsLength={commentsLength}
              />
            </li>
          );
        }

        return (
          <li key={post.id}>
            <Post
              subredditName={post.subreddit.name}
              post={post}
              votesLength={votesLength}
              commentsLength={commentsLength}
              userVote={userVote}
            />
          </li>
        );
      })}
    </ul>
  );
};
