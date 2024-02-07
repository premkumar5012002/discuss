import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import { Navbar } from "@/components/nav-bar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discuss",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {modal}
          <Navbar />
          <div className="mx-auto max-w-screen-xl px-6 pb-6 pt-12">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
