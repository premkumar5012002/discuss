import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { UsernameForm } from "@/components/settings/username-form";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

export default async function Page() {
  const session = await getAuthSession();

  if (session === null) {
    return redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid items-start gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>

        <div className="grid gap-10">
          <UsernameForm session={session} />
        </div>
      </div>
    </div>
  );
}
