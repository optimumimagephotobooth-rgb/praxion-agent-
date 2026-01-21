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
      ? query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
      : query;

    const { data, count, error } = await filteredQuery;
    if (error) {
      return NextResponse.json({ error: "SUPABASE_QUERY_FAILED" }, { status: 500 });
    }

    return NextResponse.json({
      data: data ?? [],
      meta: {
        page,
        limit,
        total: count ?? 0
      }
    });
  }

  const allCustomers = [
    {
      id: 1,
      name: "Acme Corp",
      email: "john@acme.com",
      status: "ACTIVE",
      plan: "Pro"
    },
    {
      id: 2,
      name: "Globex Inc",
      email: "sarah@globex.com",
      status: "PAUSED",
      plan: "Starter"
    },
    {
      id: 3,
      name: "Soylent Corp",
      email: "bob@soylent.com",
      status: "TERMINATED",
      plan: "Enterprise"
    }
  ];

  const filtered = search
    ? allCustomers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
      )
    : allCustomers;

  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

  return NextResponse.json({
    data,
    meta: {
      page,
      limit,
      total: filtered.length
    }
  });
}
