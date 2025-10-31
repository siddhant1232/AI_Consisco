// app/client-provider.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!pk) {
    console.warn("❌ Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ClerkProvider
      publishableKey={pk}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
