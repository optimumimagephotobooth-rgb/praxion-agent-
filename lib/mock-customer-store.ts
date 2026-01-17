import { type CustomerStatus } from "@/lib/api";

type CustomerState = {
  id: number;
  status: CustomerStatus;
};

const store = new Map<number, CustomerState>();

export function getCustomer(id: number): CustomerState {
  return store.get(id) ?? { id, status: "PAUSED" };
}

export function activateCustomer(id: number) {
  store.set(id, { id, status: "ACTIVE" });
}

export function deactivateCustomer(id: number) {
  store.set(id, { id, status: "TERMINATED" });
}
