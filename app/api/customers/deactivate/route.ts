import { NextRequest, NextResponse } from "next/server";
import { deactivateCustomer } from "@/lib/mock-customer-store";
import { emitEvent } from "@/lib/domain-events";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { type CustomerStatus } from "@/lib/api";

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
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("customers")
      .select("id,status")
      .eq("id", customerId)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const allowedTransitions: Record<CustomerStatus, CustomerStatus[]> = {
      PAUSED: ["ACTIVE", "TERMINATED"],
      ACTIVE: ["TERMINATED"],
      TERMINATED: ["ACTIVE"]
    };
    const currentStatus = data.status as CustomerStatus;
    const allowedNext = allowedTransitions[currentStatus] ?? [];
    if (!allowedNext.includes("TERMINATED")) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("customers")
      .update({ status: "TERMINATED" })
      .eq("id", customerId);

    if (updateError) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    emitEvent({
      type: "CUSTOMER_DEACTIVATED",
      customerId,
      timestamp: new Date().toISOString(),
      payload: reason ? { reason } : undefined
    });

    return NextResponse.json({ success: true });
  }

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
