"use client";

import Image from "next/image";
import { toast } from "sonner";
import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { Button, cn } from "@nextui-org/react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const UserAuthForm: FC<Props> = ({ className }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (e) {
      toast.error("There was a problem.", {
        description: "There was an error logging in with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <Button fullWidth isLoading={isLoading} onClick={loginWithGoogle}>
        {isLoading === false && (
          <Image src="/google.svg" width={22} height={22} alt="Google Logo" />
        )}
        <span>Continue with Google</span>
      </Button>
    </div>
  );
};
