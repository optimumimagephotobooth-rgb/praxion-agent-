import { NextRequest, NextResponse } from "next/server";

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
