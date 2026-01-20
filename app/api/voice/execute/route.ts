import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { isOptedOut } from "../../../../lib/sms-optout-store";
import { getCustomer } from "../../../../lib/mock-customer-store";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID ?? "",
  process.env.TWILIO_AUTH_TOKEN ?? ""
);

type VoiceExecutePayload = {
  customerId: string;
  to: string;
  message: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as VoiceExecutePayload;
  const voiceEnabled = process.env.VOICE_ENABLED === "true";

  if (!voiceEnabled) {
    console.log("VOICE DRY-RUN:", body);
    return NextResponse.json({ called: false, dryRun: true });
  }

  const customerId = Number(body.customerId);
  if (Number.isNaN(customerId)) {
    return NextResponse.json({ called: false, reason: "INVALID_CUSTOMER" }, { status: 400 });
  }

  const customer = getCustomer(customerId);
  if (customer.status !== "ACTIVE") {
    console.log("VOICE BLOCKED (CUSTOMER INACTIVE):", customerId);
    return NextResponse.json({ called: false, reason: "CUSTOMER_INACTIVE" });
  }

  if (customer.smsAllowed === false) {
    console.log("VOICE BLOCKED (CUSTOMER SMS DISABLED):", customerId);
    return NextResponse.json({ called: false, reason: "CUSTOMER_DISABLED" });
  }

  if (customer.voiceEnabled === false) {
    console.log("VOICE BLOCKED (VOICE DISABLED):", customerId);
    return NextResponse.json({ called: false, reason: "VOICE_DISABLED" });
  }

  if (isOptedOut(body.to)) {
    console.log("VOICE BLOCKED (OPT-OUT):", body.to);
    return NextResponse.json({ called: false, reason: "OPTED_OUT" });
  }

  try {
    const call = await client.calls.create({
      to: body.to,
      from: process.env.TWILIO_FROM_NUMBER ?? "",
      twiml: `<Response><Say>${body.message}</Say></Response>`
    });

    return NextResponse.json({ called: true, sid: call.sid });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Voice call failed";
    console.error("Voice call failed:", message);
    return NextResponse.json({ called: false }, { status: 500 });
  }
}
