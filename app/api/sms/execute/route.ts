import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import { isOptedOut } from "../../../../lib/sms-optout-store";
import { getCustomer } from "../../../../lib/mock-customer-store";

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID ?? "",
  process.env.TWILIO_AUTH_TOKEN ?? ""
);

type SmsExecutePayload = {
  customerId: string;
  to: string;
  template: string;
  context?: Record<string, string>;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SmsExecutePayload;
  const smsEnabled = process.env.SMS_ENABLED === "true";

  if (!smsEnabled) {
    console.log("SMS DRY-RUN:", body);
    return NextResponse.json({ sent: false, dryRun: true });
  }

  const customerId = Number(body.customerId);
  if (Number.isNaN(customerId)) {
    return NextResponse.json({ sent: false, reason: "INVALID_CUSTOMER" }, { status: 400 });
  }

  const customer = getCustomer(customerId);
  if (customer.status !== "ACTIVE") {
    console.log("SMS BLOCKED (CUSTOMER INACTIVE):", customerId);
    return NextResponse.json({ sent: false, reason: "CUSTOMER_INACTIVE" });
  }
  if (customer.smsAllowed === false) {
    console.log("SMS BLOCKED (CUSTOMER DISABLED):", customerId);
    return NextResponse.json({ sent: false, reason: "CUSTOMER_DISABLED" });
  }

  if (isOptedOut(body.to)) {
    console.log("SMS BLOCKED (OPT-OUT):", body.to);
    return NextResponse.json({ sent: false, reason: "OPTED_OUT" });
  }

  const message = renderTemplate(body.template, body.context);

  try {
    const result = await twilio.messages.create({
      to: body.to,
      from: process.env.TWILIO_FROM_NUMBER ?? "",
      body: message
    });

    return NextResponse.json({
      sent: true,
      sid: result.sid
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Twilio request failed";
    console.error("Twilio error:", message);
    return NextResponse.json(
      { sent: false, error: "SMS_FAILED" },
      { status: 500 }
    );
  }
}

function renderTemplate(
  template: string,
  context: Record<string, string> = {}
) {
  switch (template) {
    case "MISSED_CALL_FOLLOWUP":
      return `Hi, this is ${context.businessName ?? "our team"}. Sorry we missed your call — reply YES to book or STOP to opt out.`;
    case "BOOKING_LINK":
      return `Great! You can book here: ${context.bookingUrl ?? ""}`;
    default:
      return "Hello from Praxion.";
  }
}
