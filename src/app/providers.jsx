"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

import { queryClient } from "@/lib/queryClient";
import { setCachedSession } from "@/lib/sessionTokenCache";

function SessionTokenCache() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      setCachedSession(session);
    }
  }, [session, status]);

  return null;
}

export default function AppProviders({ children }) {
  return (
    <AntdRegistry>
      <SessionProvider refetchOnWindowFocus={false}>
        <SessionTokenCache />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </AntdRegistry>
  );
}
