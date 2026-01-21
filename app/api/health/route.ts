import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

export async function GET() {
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
      configured: Boolean(supabase),
      ok: supabaseOk,
      error: supabaseError
    },
    n8n: {
      configured: Boolean(process.env.N8N_WEBHOOK_URL)
    }
  });
}
