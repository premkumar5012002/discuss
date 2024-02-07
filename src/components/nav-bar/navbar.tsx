import {
  Button,
  NavbarBrand,
  NavbarContent,
  Navbar as NextUINavbar,
} from "@nextui-org/react";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

import { getAuthSession } from "@/lib/auth";

import { UserAccountNav } from "./user-account-nav";
import { SearchBar } from "../nav-bar/search-bar";

export const Navbar: FC = async () => {
  const session = await getAuthSession();

  return (
    <NextUINavbar maxWidth="full" isBordered>
      <NavbarBrand as={Link} href="/">
        <Image src="/discuss.svg" width={40} height={40} alt="Logo" />
        <p className="pl-1 text-xl font-bold text-inherit">Discuss</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <SearchBar />

        {session ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Button as={Link} color="primary" href="/sign-in">
            Sign In
          </Button>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};
