// app/ClientProviders.tsx
"use client";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
