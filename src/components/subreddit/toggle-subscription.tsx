"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Button } from "@nextui-org/react";
import { FC, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";

import { usePremadeToast } from "@/hooks/use-premade-toast";

export const ToggleSubscription: FC<{
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}> = ({ subredditName, subredditId, isSubscribed }) => {
  const router = useRouter();

  const { loginToast } = usePremadeToast();

  const { mutate: subscribe, isPending: isSubscribePending } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = { subredditId };
      const { data } = await axios.post<string>(
        "/api/subreddit/subscribe",
        payload,
      );
      return data;
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          return loginToast();
        }
      }
      return toast.error("There was a problem", {
        description: "Something went wrong, please try again.",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      toast.success("Subscribed", {
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isPending: isUnsubscribePending } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = { subredditId };
      const { data } = await axios.post<string>(
        "/api/subreddit/unsubscribe",
        payload,
      );
      return data;
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          return loginToast();
        }
      }
      return toast.error("There was a problem", {
        description: "Something went wrong, please try again.",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      return toast.success("Unsubscribed", {
        description: `You are now unsubscribed to r/${subredditName}`,
      });
    },
  });

  return (
    <div className="mb-2.5 pt-5">
      {isSubscribed ? (
        <Button
          fullWidth
          color="danger"
          isLoading={isUnsubscribePending}
          onClick={() => unsubscribe()}
        >
          Leave community
        </Button>
      ) : (
        <Button
          fullWidth
          color="primary"
          isLoading={isSubscribePending}
          onClick={() => subscribe()}
        >
          Join to post
        </Button>
      )}
    </div>
  );
};
