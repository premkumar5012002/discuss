"use client";

import { FC } from "react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Badge, Card, Input } from "@nextui-org/react";

export const MiniCreatePost: FC<{ session: Session | null }> = ({
  session,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card className="overflow-hidden">
      <div className="flex h-full items-center justify-between gap-6 px-6 py-4">
        <Badge
          content=""
          color="success"
          shape="circle"
          placement="bottom-right"
        >
          <Avatar
            showFallback
            alt="User Avatar"
            src={session?.user.image ?? undefined}
          />
        </Badge>

        <Input
          readOnly
          labelPlacement="outside"
          placeholder="Create post"
          onClick={() => router.push(pathname + "/submit")}
        />
      </div>
    </Card>
  );
};
