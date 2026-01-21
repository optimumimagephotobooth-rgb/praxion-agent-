import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    name: data.full_name ?? data.email,
    email: data.email,
    phone: data.phone ?? undefined,
    status: data.status ?? "PAUSED",
    plan:
      typeof data.metadata === "object" && data.metadata
        ? (data.metadata as Record<string, unknown>).plan
        : undefined,
    createdAt: data.created_at ?? undefined,
    lastEvent: data.updated_at ?? undefined
  });
}
