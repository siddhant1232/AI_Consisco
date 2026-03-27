import { headers } from "next/headers";
import { NextResponse } from "next/response";
import Stripe from "stripe";
import postgres from "postgres";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any, // Using typical stripe version
});

// Reuse connection setup directly for webhook without Next.js cache conflicts
const sql = postgres(process.env.DATABASE_URL as string, {
  ssl: "require",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User ID is missing in Stripe metadata", {
        status: 400,
      });
    }

    const clerkUserId = session.metadata.userId; // Passed via clerk via client_reference_id or metadata

    try {
      // 1. Update the Users table with Stripe Details
      await sql`
        UPDATE users 
        SET customer_id = ${session.customer as string},
            price_id = ${subscription.items.data[0].price.id},
            status = ${subscription.status}
        WHERE id = ${clerkUserId} -- assuming id corresponds to clerk id or map email
        -- Usually mapping by email is safer if userId doesn't perfectly match uuid vs clerk format
      `;

      // 2. Log Payment in Payments table
      await sql`
        INSERT INTO payments (
          amount, 
          status, 
          stripe_payment_id, 
          price_id, 
          user_email
        ) VALUES (
          ${session.amount_total},
          ${session.payment_status},
          ${session.payment_intent as string || session.id},
          ${subscription.items.data[0].price.id},
          ${session.customer_details?.email || ""}
        )
      `;
    } catch (err) {
      console.error("DB Error processing Stripe Webhook", err);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    // Renewal logic here
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await sql`
      UPDATE users 
      SET price_id = ${subscription.items.data[0].price.id},
          status = ${subscription.status}
      WHERE customer_id = ${session.customer as string}
    `;
  }

  return new NextResponse("Webhook Successfully Received", { status: 200 });
}
