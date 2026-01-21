import { type CustomerStatus } from "@/lib/api";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { getCustomer as getMockCustomer } from "@/lib/mock-customer-store";

type CustomerAccessState = {
  status: CustomerStatus;
  smsAllowed: boolean;
  voiceEnabled: boolean;
};

const normalizeBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return fallback;
};

export async function getCustomerAccessState(customerId: number): Promise<CustomerAccessState> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("customers")
      .select("status,sms_allowed,voice_enabled,smsAllowed,voiceEnabled")
      .eq("id", customerId)
      .single();

    if (!error && data) {
      const status = (data.status as CustomerStatus) ?? "PAUSED";
      return {
        status,
        smsAllowed: normalizeBoolean(
          (data as Record<string, unknown>).sms_allowed ??
            (data as Record<string, unknown>).smsAllowed,
          true
        ),
        voiceEnabled: normalizeBoolean(
          (data as Record<string, unknown>).voice_enabled ??
            (data as Record<string, unknown>).voiceEnabled,
          false
        )
      };
    }
  }

  const fallback = getMockCustomer(customerId);
  return {
    status: fallback.status,
    smsAllowed: fallback.smsAllowed,
    voiceEnabled: fallback.voiceEnabled
  };
}
