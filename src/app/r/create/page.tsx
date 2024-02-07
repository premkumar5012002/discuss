"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  SubredditValidator,
  CreateSubredditPayload,
} from "@/lib/validators/subreddit";

import { usePremadeToast } from "@/hooks/use-premade-toast";

export default function Page() {
  const router = useRouter();

  const { loginToast } = usePremadeToast();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<CreateSubredditPayload>({
    resolver: zodResolver(SubredditValidator),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createCommunity, isPending } = useMutation({
    mutationFn: async (name: string) => {
      const payload: CreateSubredditPayload = { name };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 409) {
          return toast.error("Subreddit already exists.", {
            description: "Please choose a different subreddit name.",
          });
        }

        if (e.response?.status === 422) {
          return toast.error("Invalid subreddit name.", {
            description: "Please choose a name between 3 and 21 characters.",
          });
        }

        if (e.response?.status === 401) {
          return loginToast();
        }
      }

      toast.error("There was an error", {
        description: "Could not create subreddit.",
      });
    },
    onSuccess: (data) => {
      router.replace(`/r/${data}`);
    },
  });

  const onSubmit = handleSubmit((data) => {
    createCommunity(data.name);
  });

  return (
    <form
      className="container mx-auto flex h-full max-w-xl items-center"
      onSubmit={onSubmit}
    >
      <Card className="w-full space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <div className="h-[1px] bg-divider" />

        <div className="pt-2">
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs text-default-500">
            Community names including capitalization cannot be changed.
          </p>

          <div className="pt-4">
            <Input
              {...register("name")}
              size="sm"
              isRequired
              variant="bordered"
              startContent={<p className="text-default-500">r/</p>}
              color={errors.name ? "danger" : "default"}
              errorMessage={errors.name && errors.name.message}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="flat" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={isPending}
            isDisabled={isDirty === false}
          >
            Create Community
          </Button>
        </div>
      </Card>
    </form>
  );
}
