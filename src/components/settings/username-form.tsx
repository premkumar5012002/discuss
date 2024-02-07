"use client";

import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { FC, startTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  ChangeUsernameRequest,
  UsernameValidator,
} from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

export const UsernameForm: FC<{ session: Session }> = ({ session }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeUsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: session.user.username ?? undefined,
    },
  });

  const { mutate: updateUsername, isPending } = useMutation({
    mutationFn: async ({ username }: ChangeUsernameRequest) => {
      const payload: ChangeUsernameRequest = { username };
      await axios.patch(`/api/user`, payload);
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 409) {
          return toast.error("Username already taken.", {
            description: "Please choose another username.",
          });
        }
      }

      return toast.error("Something went wrong.", {
        description: "Your username was not updated. Please try again.",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      toast.success("Your username has been updated.");
    },
  });

  const onSubmit = handleSubmit((data) => {
    updateUsername(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-xl font-semibold">Your username</h2>
            <p className="text-sm text-default-500">
              Please enter a display name you are comfortable with.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <Input
            {...register("username")}
            label="Username"
            startContent="u/"
            defaultValue={session.user.username ?? undefined}
            color={errors.username ? "danger" : "default"}
            errorMessage={errors.username && errors.username.message}
          />
        </CardBody>
        <CardFooter className="justify-end">
          <Button type="submit" color="primary" isLoading={isPending}>
            Change username
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
