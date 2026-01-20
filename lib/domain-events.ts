export type DomainEventPayload = Record<string, unknown>;

export type DomainEventType =
  | "CUSTOMER_ACTIVATED"
  | "CUSTOMER_DEACTIVATED"
  | "PAYMENT_FAILED"
  | "PAYMENT_SUCCEEDED";

export type DomainEvent = {
  type: DomainEventType;
  customerId: number | string;
  timestamp: string;
  payload?: DomainEventPayload;
};

const eventLog: DomainEvent[] = [];

export function emitEvent(event: DomainEvent) {
  eventLog.push(event);
  if (process.env.NODE_ENV !== "production") {
    console.log("[DOMAIN EVENT]", event);
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  void fetch(new URL("/api/events", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event)
  }).catch(() => {
    // Silent failure by design
  });
}

export function getEventLog() {
  return [...eventLog];
}
