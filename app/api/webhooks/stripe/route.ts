import { HandleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // max 60s on Vercel

export async function POST(req: NextRequest) {
  try {
    // Stripe requires raw body
    const body = await req.text();

    const signature = (await headers()).get("stripe-signature");
    if (!signature) {
      return new NextResponse("No signature found", { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Stripe event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        // IMPORTANT: await this (see note below)
        await HandleCheckoutSessionCompleted(event.data.object);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return new NextResponse("Webhook error", { status: 400 });
  }
}
