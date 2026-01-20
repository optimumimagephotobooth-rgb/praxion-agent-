import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

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
    default:
      return "Hello from Praxion.";
  }
}
