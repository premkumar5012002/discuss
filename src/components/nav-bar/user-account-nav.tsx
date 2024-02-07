"use client";

import {
  Avatar,
  Popover,
  Listbox,
  ListboxItem,
  ListboxSection,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { FC } from "react";
import { User } from "next-auth";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import {
  IconLogout,
  IconMoon,
  IconSettings,
  IconSquareRoundedPlus,
  IconSun,
} from "@tabler/icons-react";

export const UserAccountNav: FC<{
  user: Pick<User, "name" | "image" | "email">;
}> = ({ user }) => {
  const { theme, setTheme } = useTheme();

  const onSignOut = () => {
    signOut({ callbackUrl: `${window.location.origin}/sign-in` });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar
          size="sm"
          as="button"
          isBordered
          showFallback
          alt="User Avatar"
          src={user.image ?? undefined}
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-64 space-y-1">
          <div className="border-b border-divider p-3">
            <p className="text-base font-medium">{user.name}</p>
            <p className="truncate text-sm text-default-500">{user.email}</p>
          </div>
          <Listbox>
            <ListboxSection showDivider>
              <ListboxItem
                key="create"
                href="/r/create"
                startContent={<IconSquareRoundedPlus size={18} />}
              >
                Create community
              </ListboxItem>

              {theme === "light" ? (
                <ListboxItem
                  key="theme"
                  startContent={<IconMoon size={18} />}
                  onClick={() => setTheme("dark")}
                >
                  Dark theme
                </ListboxItem>
              ) : (
                <ListboxItem
                  key="theme"
                  startContent={<IconSun size={18} />}
                  onClick={() => setTheme("light")}
                >
                  Light theme
                </ListboxItem>
              )}

              <ListboxItem
                key="settings"
                href="/settings"
                startContent={<IconSettings size={18} />}
              >
                Settings
              </ListboxItem>
            </ListboxSection>

            <ListboxItem
              key="signout"
              startContent={<IconLogout size={18} />}
              onClick={onSignOut}
            >
              Sign out
            </ListboxItem>
          </Listbox>
        </div>
      </PopoverContent>
    </Popover>
  );
};
