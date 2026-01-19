import { NextRequest, NextResponse } from "next/server";
import { activateCustomer } from "@/lib/mock-customer-store";
import { emitEvent } from "@/lib/domain-events";

/**
 * POST /api/customers/activate
 * Phase 3 — Control Plane v1
 *
 * NOTE:
 * - No Supabase yet
 * - No Stripe
 * - No automation triggers
 * - Response shape is LOCKED
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    customerId?: number;
  } | null;

  if (!body || typeof body.customerId !== "number") {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const customerId = body.customerId;
  const result = activateCustomer(customerId);
  if (!result.allowed) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (result.changed) {
    emitEvent({
      type: "CUSTOMER_ACTIVATED",
      customerId,
      timestamp: new Date().toISOString()
    });
  }

  return NextResponse.json({ success: true });
}
