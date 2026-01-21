import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

/**
 * GET /api/customers
 * Phase 2 — Backend Contract v1
 *
 * NOTE:
 * - No Supabase yet
 * - No auth yet
 * - No Stripe
 * - Shape is LOCKED
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? "";

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const query = supabase
      .from("customers")
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(start, end);

    const filteredQuery = search
      ? query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      : query;

    const { data, count, error } = await filteredQuery;
    if (error) {
      return NextResponse.json({ error: "SUPABASE_QUERY_FAILED" }, { status: 500 });
    }

    const mapped = (data ?? []).map((row) => ({
      id: row.id as string,
      name: row.full_name ?? row.email,
      email: row.email,
      phone: row.phone ?? undefined,
      status: row.status ?? "PAUSED",
      plan:
        typeof row.metadata === "object" && row.metadata
          ? (row.metadata as Record<string, unknown>).plan
          : undefined,
      createdAt: row.created_at ?? undefined,
      lastEvent: row.updated_at ?? undefined
    }));

    return NextResponse.json({
      data: mapped,
      meta: {
        page,
        limit,
        total: count ?? 0
      }
    });
  }

  return NextResponse.json({
    data: [],
    meta: {
      page,
      limit,
      total: 0
    }
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    fullName?: string;
    phone?: string;
    plan?: string;
    notes?: string;
    metadata?: Record<string, unknown>;
    authUserId?: string;
  } | null;

  if (!body?.email) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "SUPABASE_NOT_CONFIGURED" }, { status: 400 });
  }

  const authUserId = body.authUserId ?? process.env.DEFAULT_AUTH_USER_ID;
  if (!authUserId) {
    return NextResponse.json({ error: "AUTH_USER_REQUIRED" }, { status: 400 });
  }

  const metadata = {
    ...(body.metadata ?? {}),
    ...(body.plan ? { plan: body.plan } : {}),
    ...(body.notes ? { notes: body.notes } : {})
  };

  const { data, error } = await supabase
    .from("customers")
    .insert({
      auth_user_id: authUserId,
      email: body.email,
      full_name: body.fullName ?? body.email,
      phone: body.phone ?? null,
      status: "PAUSED",
      metadata
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "CUSTOMER_CREATE_FAILED" }, { status: 500 });
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
