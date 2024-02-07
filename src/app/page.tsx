import Link from "next/link";
import { Button, Card } from "@nextui-org/react";
import { IconHome } from "@tabler/icons-react";

import { getAuthSession } from "@/lib/auth";

import { CustomFeed } from "@/components/home-page/custom-feed";
import { GeneralFeed } from "@/components/home-page/general-feed";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Page() {
  const session = await getAuthSession();
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your Feed</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {session ? <CustomFeed session={session} /> : <GeneralFeed />}
        {/* Subreddit info */}
        <Card className="order-first h-fit overflow-hidden md:order-last">
          <div className="px-6 py-2">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <IconHome size={20} />
              <span>Home</span>
            </p>
          </div>
          <div className="border-t border-divider px-6 py-2 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-default-700">
                Your personal Disscuss homepage. Come here to check in with your
                favorite communities.
              </p>
            </div>
            <div className="py-2">
              <Button color="primary" fullWidth as={Link} href="/r/create">
                Create Community
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
