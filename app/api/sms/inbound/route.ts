import { NextRequest } from "next/server";
import { optOut } from "@/lib/sms-optout-store";

const STOP_KEYWORDS = new Set([
  "STOP",
  "STOPALL",
  "UNSUBSCRIBE",
  "CANCEL",
  "END"
]);

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const from = String(formData.get("From") || "");
  const body = String(formData.get("Body") || "")
    .trim()
    .toUpperCase();

  if (!from) {
    return new Response("Missing sender", { status: 400 });
  }

  if (STOP_KEYWORDS.has(body)) {
    optOut(from);

    if (process.env.NODE_ENV !== "production") {
      console.log("SMS OPT-OUT:", from);
    }

    return new Response(
      `<Response><Message>You have been unsubscribed. No further messages will be sent.</Message></Response>`,
      {
        status: 200,
        headers: { "Content-Type": "text/xml" }
      }
    );
  }

  return new Response("OK", { status: 200 });
}
