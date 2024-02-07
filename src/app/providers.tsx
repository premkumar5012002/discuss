"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NextUIProvider>
          <ThemeProvider enableSystem attribute="class">
            <Toaster richColors />
            {children}
          </ThemeProvider>
        </NextUIProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
