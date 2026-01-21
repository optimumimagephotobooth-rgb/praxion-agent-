import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

export async function GET() {
  const supabaseUrlConfigured = Boolean(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  const supabaseServiceRoleConfigured = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
  );
  const supabase = getSupabaseAdminClient();
  let supabaseOk = false;
  let supabaseError: string | null = null;

  if (supabase) {
    try {
      const { error } = await supabase.from("customers").select("id").limit(1);
      if (error) {
        supabaseError = "SUPABASE_QUERY_FAILED";
      } else {
        supabaseOk = true;
      }
    } catch {
      supabaseError = "SUPABASE_UNAVAILABLE";
    }
  }

  return NextResponse.json({
    supabase: {
      configured: supabaseUrlConfigured && supabaseServiceRoleConfigured,
      ok: supabaseOk,
      error: supabaseError,
      env: {
        url: supabaseUrlConfigured,
        serviceRoleKey: supabaseServiceRoleConfigured
      }
    },
    n8n: {
      configured: Boolean(process.env.N8N_WEBHOOK_URL)
    }
  });
}
