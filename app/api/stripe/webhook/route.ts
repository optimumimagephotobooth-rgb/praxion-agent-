import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { emitEvent } from "@/lib/domain-events";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16"
});

const getInvoiceCustomerId = (invoice: Stripe.Invoice) => {
  if (typeof invoice.customer === "string") {
    return invoice.customer;
  }
  if (invoice.customer && typeof invoice.customer === "object" && "id" in invoice.customer) {
    return invoice.customer.id;
  }
  return "unknown";
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    if (process.env.NODE_ENV !== "production") {
      console.error("Stripe webhook signature verification failed.", message);
    }
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = getInvoiceCustomerId(invoice);
      emitEvent({
        type: "PAYMENT_FAILED",
        customerId,
        timestamp: new Date().toISOString(),
        payload: {
          customerId
        }
      });
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = getInvoiceCustomerId(invoice);
      emitEvent({
        type: "PAYMENT_SUCCEEDED",
        customerId,
        timestamp: new Date().toISOString(),
        payload: {
          customerId
        }
      });
      break;
    }
    default:
      break;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("Stripe event received:", event.type);
  }

  return NextResponse.json({ received: true });
}
