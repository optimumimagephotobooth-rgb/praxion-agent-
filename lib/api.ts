export type CustomerStatus = "ACTIVE" | "PAUSED" | "TERMINATED";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  industry?: string;
  plan?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  status: CustomerStatus;
  createdAt?: string;
  lastEvent?: string;
}

export interface CustomerListParams {
  page: number;
  limit: number;
  search?: string;
}

export interface CustomerListResponse {
  data: Customer[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

async function listCustomers(
  params: CustomerListParams
): Promise<CustomerListResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    ...(params.search ? { search: params.search } : {})
  });
  const response = await fetch(`/api/customers?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load customers.");
  }
  return response.json() as Promise<CustomerListResponse>;
}

async function getCustomer(id: number): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`);
  if (!response.ok) {
    throw new Error("Failed to load customer.");
  }
  return response.json() as Promise<Customer>;
}

export const api = {
  customers: {
    list: listCustomers,
    get: getCustomer
  }
};
