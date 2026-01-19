import { type CustomerStatus } from "@/lib/api";

type CustomerState = {
  id: number;
  status: CustomerStatus;
};

const store = new Map<number, CustomerState>();

export function getCustomer(id: number): CustomerState {
  return store.get(id) ?? { id, status: "PAUSED" };
}

type TransitionResult = {
  allowed: boolean;
  changed: boolean;
  status: CustomerStatus;
};

const allowedTransitions: Record<CustomerStatus, CustomerStatus[]> = {
  PAUSED: ["ACTIVE", "TERMINATED"],
  ACTIVE: ["TERMINATED"],
  TERMINATED: ["ACTIVE"]
};

function transitionCustomer(id: number, nextStatus: CustomerStatus): TransitionResult {
  const current = getCustomer(id);
  if (current.status === nextStatus) {
    return { allowed: true, changed: false, status: current.status };
  }

  const allowedNext = allowedTransitions[current.status];
  if (!allowedNext.includes(nextStatus)) {
    return { allowed: false, changed: false, status: current.status };
  }

  const next = { id, status: nextStatus };
  store.set(id, next);
  return { allowed: true, changed: true, status: next.status };
}

export function activateCustomer(id: number) {
  return transitionCustomer(id, "ACTIVE");
}

export function deactivateCustomer(id: number) {
  return transitionCustomer(id, "TERMINATED");
}
