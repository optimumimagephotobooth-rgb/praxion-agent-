"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { api, type Customer } from "@/lib/api";

interface CustomerDetailProps {
  onNavigate: (view: string) => void;
  id?: number;
}

interface ToastState {
  message: string;
  variant: "success" | "error";
}

export function CustomerDetail({ onNavigate, id }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fetchCustomer = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await api.customers.get(id);
      setCustomer(data);
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load customer.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const showToast = (message: string, variant: ToastState["variant"]) => {
    setToast({ message, variant });
    window.setTimeout(() => setToast(null), 2500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-gray-500">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="text-lg font-medium">{error || "Customer not found."}</p>
        <Button variant="outline" onClick={() => onNavigate("list")}>
          Go back to List
        </Button>
      </div>
    );
  }

  const readinessChecks = {
    phone: Boolean(customer.phone),
    email: Boolean(customer.email),
    plan: Boolean(customer.plan)
  };

  const isReadyForActivation =
    readinessChecks.phone && readinessChecks.email && readinessChecks.plan;

  const handleDeactivate = async () => {
    if (!customer) return;
    const confirmed = window.confirm(
      "Deactivate this customer? All automation will stop immediately."
    );
    if (!confirmed) return;
    setDeactivating(true);
    try {
      const response = await fetch("/api/customers/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id })
      });
      if (!response.ok) {
        throw new Error("Deactivation failed");
      }
      showToast("Customer deactivated", "success");
      setCustomer((prev) => (prev ? { ...prev, status: "TERMINATED" } : prev));
    } catch {
      showToast("Could not deactivate customer", "error");
    } finally {
      setDeactivating(false);
    }
  };

  const handleActivate = async () => {
    if (!customer) return;
    setActivating(true);
    try {
      const response = await fetch("/api/customers/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id })
      });
      if (!response.ok) {
        throw new Error("Activation failed");
      }
      showToast("Customer activated", "success");
      setCustomer((prev) => (prev ? { ...prev, status: "ACTIVE" } : prev));
    } catch {
      showToast("Could not activate customer", "error");
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {toast && (
        <div className="fixed right-6 top-6 z-50">
          <Toast variant={toast.variant}>{toast.message}</Toast>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => onNavigate("list")}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Customer Details
          </h1>
        </div>
        <Badge
          variant={
            customer.status === "ACTIVE"
              ? "success"
              : customer.status === "TERMINATED"
              ? "destructive"
              : "warning"
          }
        >
          {customer.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="space-y-3 p-6">
          <div
            className={`rounded-md border px-3 py-2 text-sm font-medium ${
              isReadyForActivation
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {isReadyForActivation ? "READY" : "NOT READY"}
          </div>
          <p className="text-sm text-gray-600">
            {isReadyForActivation
              ? "Customer is ready for activation."
              : "Missing required setup to activate this customer."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Badge variant={isReadyForActivation ? "success" : "warning"}>
              {isReadyForActivation ? "READY" : "NOT READY"}
            </Badge>
            <span className="text-sm text-gray-700">
              {isReadyForActivation
                ? "Customer is ready for activation"
                : "Complete required setup before activation"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Business Information
          </h3>
          <Card className="h-full">
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoRow label="Business Name" value={customer.name} />
                <InfoRow label="Email" value={customer.email} />
                <InfoRow label="Business Phone" value={customer.phone || "—"} />
                <InfoRow label="Plan" value={customer.plan || "—"} />
                <InfoRow label="Industry" value={customer.industry || "—"} />
                <InfoRow label="Address" value={customer.address || "—"} />
                <InfoRow label="Tax ID" value={customer.taxId || "—"} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Activation Readiness
          </h3>
          <Card className="h-full">
            <CardContent className="space-y-3 p-6">
              <div className="space-y-2">
                <ChecklistItem
                  label="Business phone"
                  ok={readinessChecks.phone}
                />
                <ChecklistItem label="Contact email" ok={readinessChecks.email} />
                <ChecklistItem label="Plan selected" ok={readinessChecks.plan} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <div
            title={
              isReadyForActivation
                ? "Activate customer"
                : "Complete required fields before activation"
            }
          >
            <Button
              onClick={handleActivate}
              disabled={!isReadyForActivation || activating}
            >
              {activating ? "Activating…" : "Activate Customer"}
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleDeactivate}
            disabled={deactivating}
          >
            {deactivating ? "Deactivating…" : "Deactivate"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ChecklistItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
      <span className="text-gray-700">{label}</span>
      <span className={ok ? "text-emerald-600" : "text-gray-400"}>
        {ok ? "Ready" : "Missing"}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-sm text-gray-500">{label}</div>
      <div className="break-words text-base font-medium text-gray-900">
        {value}
      </div>
    </div>
  );
}
