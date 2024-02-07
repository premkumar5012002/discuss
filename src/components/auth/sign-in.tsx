import { FC } from "react";
import Image from "next/image";
import { Link } from "@nextui-org/react";

import { UserAuthForm } from "../auth/user-auth-form";

export const SignIn: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Image
          width={70}
          height={70}
          alt="Logo"
          src="/discuss.svg"
          className="mx-auto"
        />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mx-auto max-w-xs text-sm text-default-500">
          By continuing, you are setting up a Discuss account and agree to our
          User Agreement and Privacy Policy.
        </p>

        <UserAuthForm className="py-3" />

        <p className="px-8 text-center text-sm text-default-500">
          New to Discuss?{" "}
          <Link
            href="/sign-up"
            color="foreground"
            className="text-sm underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
