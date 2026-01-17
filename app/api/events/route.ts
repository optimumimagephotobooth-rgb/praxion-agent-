import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = await req.json();

  if (!event?.type || !event?.customerId || !event?.timestamp) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (!process.env.N8N_WEBHOOK_URL) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("N8N_WEBHOOK_URL is not set; event forwarding skipped.");
    }
    return NextResponse.json({ success: true });
  }

  try {
    await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("n8n webhook failed", err);
    }
  }

  return NextResponse.json({ success: true });
}
