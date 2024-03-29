"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { VoteType } from "~/prisma/generated/client";
import { Button } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  IconArrowBigUp,
  IconArrowBigDown,
  IconArrowBigUpFilled,
  IconArrowBigDownFilled,
} from "@tabler/icons-react";

import { CommentVoteRequest } from "@/lib/validators/vote";

import { usePremadeToast } from "@/hooks/use-premade-toast";

export const CommentVotes: FC<{
  commentId: string;
  initialVotesLength: number;
  initialUserVoteType?: VoteType | null;
}> = ({ commentId, initialVotesLength, initialUserVoteType }) => {
  const { loginToast } = usePremadeToast();

  const [userVote, setUserVote] = useState(initialUserVoteType);
  const [votesLength, setVotesLength] = useState(initialVotesLength);
  const [previousUserVote] = useState(initialUserVoteType);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = { commentId, voteType };
      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },
    onError: (e, voteType) => {
      adjustVotesLength(voteType);

      // Reset to user previous vote
      setUserVote(previousUserVote);

      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          loginToast();
        }
      }

      toast.error("Something went wrong", {
        description: "Your vote was unsuccessful, please try again.",
      });
    },
    onMutate: (voteType) => {
      if (userVote === voteType) {
        setUserVote(null);
        adjustVotesLength(voteType);
      } else {
        setUserVote(voteType);
        // If user is already voted than is 2 if not is 1
        const vote = userVote ? 2 : 1;
        if (voteType === "UP") {
          setVotesLength((prevVotesLength) => prevVotesLength + vote);
        } else if (voteType === "DOWN") {
          setVotesLength((prevVotesLength) => prevVotesLength - vote);
        }
      }
    },
  });

  const adjustVotesLength = (voteType: VoteType) => {
    if (voteType === "UP") {
      setVotesLength((prevVotesLength) => prevVotesLength - 1);
    } else if (voteType === "DOWN") {
      setVotesLength((prevVotesLength) => prevVotesLength + 1);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        isIconOnly
        variant="light"
        aria-label="upvote"
        color={userVote === "UP" ? "success" : "default"}
        onClick={() => vote("UP")}
      >
        {userVote === "UP" ? (
          <IconArrowBigUpFilled size={18} />
        ) : (
          <IconArrowBigUp size={18} />
        )}
      </Button>

      <p className="text-center text-sm font-medium">{votesLength}</p>

      <Button
        size="sm"
        isIconOnly
        variant="light"
        aria-label="downvote"
        color={userVote === "DOWN" ? "danger" : "default"}
        onClick={() => vote("DOWN")}
      >
        {userVote === "DOWN" ? (
          <IconArrowBigDownFilled size={18} />
        ) : (
          <IconArrowBigDown size={18} />
        )}
      </Button>
    </div>
  );
};
