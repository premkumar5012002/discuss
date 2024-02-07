"use client";

import axios from "axios";
import { FC } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PostCreationRequest, PostValidator } from "@/lib/validators/post";

import Tiptap from "../editor";

export const PostEditor: FC<{ subredditId: string; subredditName: string }> = ({
  subredditId,
  subredditName,
}) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: { subredditId, title: "", content: undefined },
  });

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId };
      await axios.post("/api/subreddit/post/create", payload);
    },
    onError: () => {
      toast.error("Something went wrong.", {
        description: "Your post was not published. Please try again.",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts", subredditName],
      });

      router.push(`/r/${subredditName}`);

      toast.success("Your post has been published.");
    },
  });

  const onSubmit = handleSubmit((data) => createPost(data));

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <div className="space-y-6">
        <Textarea
          {...register("title")}
          fullWidth
          size="lg"
          radius="md"
          minRows={1}
          variant="underlined"
          placeholder="Title for the post"
          color={errors.title ? "danger" : "default"}
          errorMessage={errors.title && errors.title.message}
        />
        <Tiptap
          onUpdate={(content) => setValue("content", JSON.stringify(content))}
        />
      </div>
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          color="primary"
          isLoading={isPending}
          isDisabled={isDirty === false}
        >
          Post
        </Button>
      </div>
    </form>
  );
};
