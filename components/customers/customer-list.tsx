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
import { N8nStatusIndicator } from "@/components/n8n";
import { RippleButton } from "@/components/effects";

interface CustomerListProps {
  onNavigate: (view: string, id?: string) => void;
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
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-400">
        <AlertTriangle className="h-10 w-10 text-rose-400" />
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
          <h1 className="text-2xl font-semibold text-slate-100">Customers</h1>
          <p className="text-sm text-slate-400">
            Manage customer accounts and activation status
          </p>
        </div>
        <RippleButton onClick={() => setShowAddDialog(true)} className="px-5 py-2.5">
          <Plus className="h-4 w-4" />
          Add Customer
        </RippleButton>
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
        onCreate={async (payload) => {
          const response = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: payload.email,
              fullName: payload.name,
              phone: payload.phone,
              plan: payload.plan,
              notes: payload.notes
            })
          });
          const responseBody = await response.json().catch(() => null);
          if (!response.ok) {
            throw new Error(
              responseBody?.details ||
                responseBody?.error ||
                "Failed to create customer."
            );
          }
          setShowAddDialog(false);
          await fetchCustomers();
        }}
      />

      <Card className="glass-card card-3d">
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Customer List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700/60 bg-slate-900/70 text-slate-300">
              <tr>
                <th className="px-6 py-3 text-left">Business</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Plan</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer border-b border-slate-800/60 hover:bg-slate-800/50"
                    onClick={() => onNavigate("detail", customer.id)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-100">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <N8nStatusIndicator
                          status={
                            customer.status === "ACTIVE"
                              ? "active"
                              : customer.status === "PAUSED"
                              ? "warning"
                              : "error"
                          }
                          size="sm"
                        />
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
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {customer.plan || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-slate-700/60 px-6 py-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-slate-400">Page {page}</span>

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
