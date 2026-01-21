import { NextRequest, NextResponse } from "next/server";
import { activateCustomer } from "@/lib/mock-customer-store";
import { emitEvent } from "@/lib/domain-events";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { type CustomerStatus } from "@/lib/api";

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
    if (!allowedNext.includes("ACTIVE")) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("customers")
      .update({ status: "ACTIVE" })
      .eq("id", customerId);

    if (updateError) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    emitEvent({
      type: "CUSTOMER_ACTIVATED",
      customerId,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ success: true });
  }

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
