"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function createCheckoutSession(priceId: string) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const email = user.emailAddresses[0].emailAddress;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/#pricing`,
    customer_email: email,
    metadata: {
      userId: userId,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create stripe session");
  }

  redirect(session.url);
}
