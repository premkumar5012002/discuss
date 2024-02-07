"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { FC, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CommentRequest, CommentValidator } from "@/lib/validators/comment";

import { usePremadeToast } from "@/hooks/use-premade-toast";

export const CreateComment: FC<{
  postId: string;
  replyToId?: string;
  onHideCreateComment?: () => void;
}> = async ({ postId, replyToId, onHideCreateComment }) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { loginToast } = usePremadeToast();

  const { register, reset, handleSubmit } = useForm<CommentRequest>({
    resolver: zodResolver(CommentValidator),
    defaultValues: {
      postId,
      replyToId,
      comment: "",
    },
  });

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: async ({ postId, comment, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, comment, replyToId };
      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
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
      toast.error("There was a problem", {
        description: "Could not create comment.",
      });
    },
    onSuccess: async () => {
      if (onHideCreateComment && replyToId) {
        onHideCreateComment();
      } else {
        startTransition(() => router.refresh());
      }
      reset();
    },
  });

  const onSubmit = handleSubmit((data) => {
    createComment(data);
  });

  return (
    <form className="grid w-full gap-1.5" onSubmit={onSubmit}>
      <Textarea
        {...register("comment")}
        label="Your comment"
        labelPlacement="outside"
        placeholder="What are your thoughts?"
      />

      <div className="mt-3 flex justify-end gap-1.5">
        {onHideCreateComment ? (
          <Button onClick={onHideCreateComment} variant="light">
            Cancel
          </Button>
        ) : null}

        <Button type="submit" color="primary" isLoading={isPending}>
          Post
        </Button>
      </div>
    </form>
  );
};
