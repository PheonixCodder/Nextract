import { HandleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // IMPORTANT for Stripe + Prisma
export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.text();

    const signature = (await headers()).get("stripe-signature");
    if (!signature) {
      return new NextResponse("No signature found", { status: 400 });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      secret
    );

    switch (event.type) {
      case "checkout.session.completed":
        await HandleCheckoutSessionCompleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return new NextResponse("Webhook error", { status: 400 });
  }
}
