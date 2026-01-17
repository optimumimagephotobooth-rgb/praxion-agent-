"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Customer } from "@/lib/api";
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";

interface CustomerListProps {
  onNavigate: (view: string, id?: number) => void;
}

export function CustomerList({ onNavigate }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.customers.list({
        page,
        limit: 10,
        search
      });
      setCustomers(result.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load customers.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-gray-500">
        <AlertTriangle className="h-10 w-10 text-red-400" />
        <p>{error}</p>
        <Button variant="outline" onClick={fetchCustomers}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">
            Manage customer accounts and activation status
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Input
        placeholder="Search customers…"
        value={search}
        onChange={(event) => {
          setPage(1);
          setSearch(event.target.value);
        }}
      />

      <AddCustomerDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onCreate={(payload) => {
          const newCustomer: Customer = {
            id: Date.now(),
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            status: "PAUSED",
            plan: payload.plan
          };
          setCustomers((prev) => [newCustomer, ...prev]);
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wide text-gray-600">
            Customer List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Business</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Plan</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onNavigate("detail", customer.id)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          customer.status === "ACTIVE"
                            ? "success"
                            : customer.status === "PAUSED"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {customer.status === "PAUSED" ? "INACTIVE" : customer.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {customer.plan || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t px-6 py-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-gray-500">Page {page}</span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => current + 1)}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
