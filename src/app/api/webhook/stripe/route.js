import Stripe from "stripe";
import { headers } from "next/headers";
import {connectMongoDB} from "@/lib/db";
import Order from "@/models/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  await connectMongoDB();

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        stripePaymentId: paymentIntent.id,
      });

      console.log("✅ Order marked as PAID:", orderId);
    }
  }

  return new Response("ok", { status: 200 });
}