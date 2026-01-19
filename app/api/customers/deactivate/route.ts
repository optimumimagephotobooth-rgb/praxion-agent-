import { NextRequest, NextResponse } from "next/server";
import { deactivateCustomer } from "@/lib/mock-customer-store";
import { emitEvent } from "@/lib/domain-events";

/**
 * POST /api/customers/deactivate
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
    reason?: string;
  } | null;

  if (!body || typeof body.customerId !== "number") {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (body.reason !== undefined && typeof body.reason !== "string") {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const customerId = body.customerId;
  const reason = body.reason;
  const result = deactivateCustomer(customerId);
  if (!result.allowed) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (result.changed) {
    emitEvent({
      type: "CUSTOMER_DEACTIVATED",
      customerId,
      timestamp: new Date().toISOString(),
      payload: reason ? { reason } : undefined
    });
  }

  return NextResponse.json({ success: true });
}
