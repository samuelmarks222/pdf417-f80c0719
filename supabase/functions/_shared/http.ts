import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function preflight(request: Request) {
  return request.method === "OPTIONS"
    ? new Response("ok", { headers: corsHeaders })
    : null;
}

export function serviceClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY");
  if (!url || !key) throw new Error("Supabase service configuration is missing");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function authenticatedUser(request: Request) {
  const authorization = request.headers.get("Authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!token || !url || !key) return null;

  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  return error ? null : data.user;
}

export async function recordPaymentEvent(
  client: SupabaseClient,
  paymentId: string | null,
  provider: "sasapay" | "plisio",
  eventType: string,
  message: string | null,
  payload: Record<string, unknown> = {},
) {
  const { error } = await client.from("payment_events").insert({
    payment_id: paymentId,
    provider,
    event_type: eventType,
    message,
    payload,
  });
  if (error) console.error("Could not save payment event:", error.message);
}

export async function updatePaymentStatus(
  client: SupabaseClient,
  paymentId: string,
  status: "pending" | "failed" | "cancelled" | "expired" | "underpaid",
  error: string | null,
  providerData: Record<string, unknown> = {},
) {
  const { error: rpcError } = await client.rpc("update_credit_payment_status", {
    p_payment_id: paymentId,
    p_status: status,
    p_error: error,
    p_provider_data: providerData,
  });
  if (rpcError) throw rpcError;
}

export async function confirmPayment(
  client: SupabaseClient,
  paymentId: string,
  providerReference: string,
  providerData: Record<string, unknown>,
) {
  const { data, error } = await client.rpc("confirm_credit_payment", {
    p_payment_id: paymentId,
    p_provider_reference: providerReference,
    p_provider_data: providerData,
  });
  if (error) throw error;
  return data as boolean;
}
