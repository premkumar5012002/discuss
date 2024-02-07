import { NextPage } from "next";

import { SignIn } from "@/components/auth/sign-in";

const Page: NextPage = () => {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-20 px-4">
        <SignIn />
      </div>
    </div>
  );
};

export default Page;
