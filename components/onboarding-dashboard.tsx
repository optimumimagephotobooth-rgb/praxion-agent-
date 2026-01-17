"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";

type SubscriptionStatus = "ACTIVE" | "INACTIVE";
type UiCustomerStatus = "INACTIVE" | "ACTIVE" | "TERMINATED";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: "starter" | "pro" | "enterprise";
  stripeCustomerId: string;
  subscriptionStatus: SubscriptionStatus;
  status: UiCustomerStatus;
  notes?: string;
  industry?: string;
  address?: string;
}

interface ToastState {
  message: string;
  variant: "success" | "error";
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Acme Heating Co.",
    email: "ops@acmeheating.com",
    phone: "+1 (555) 010-8899",
    plan: "pro",
    stripeCustomerId: "cus_123",
    subscriptionStatus: "ACTIVE",
    status: "ACTIVE",
    notes: "Prefers SMS after hours.",
    industry: "Trades",
    address: "123 Main St, Leeds"
  }
];

function getReadiness(customer: Customer) {
  const missing: string[] = [];
  if (!customer.phone) missing.push("phone number");
  if (!customer.email) missing.push("email");
  if (!customer.plan) missing.push("plan");
  if (!customer.stripeCustomerId) missing.push("Stripe ID");
  if (customer.subscriptionStatus !== "ACTIVE") missing.push("active payment");
  if (customer.status === "TERMINATED") missing.push("active status");

  const checklist = [
    { label: "Business phone entered", ok: Boolean(customer.phone) },
    { label: "Email present", ok: Boolean(customer.email) },
    { label: "Plan selected", ok: Boolean(customer.plan) },
    {
      label: "Stripe active",
      ok: customer.subscriptionStatus === "ACTIVE"
    }
  ];

  return {
    ready: missing.length === 0,
    missing,
    checklist
  };
}

export function OnboardingDashboard() {
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [selectedId, setSelectedId] = React.useState<number>(
    initialCustomers[0]?.id ?? 0
  );
  const [showForm, setShowForm] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<ToastState | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const selectedCustomer = customers.find((customer) => customer.id === selectedId);

  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    phone: "",
    plan: "starter" as Customer["plan"],
    stripeCustomerId: "",
    subscriptionStatus: "INACTIVE" as SubscriptionStatus,
    notes: "",
    industry: "",
    address: ""
  });

  const readiness = selectedCustomer ? getReadiness(selectedCustomer) : null;

  const showToast = (message: string, variant: ToastState["variant"]) => {
    setToast({ message, variant });
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleAddCustomer = () => {
    setFormError(null);
    const missing: string[] = [];
    if (!formState.name.trim()) missing.push("Business name");
    if (!formState.email.trim()) missing.push("Contact email");
    if (!formState.phone.trim()) missing.push("Business phone");
    if (!formState.plan) missing.push("Plan");
    if (!formState.stripeCustomerId.trim()) missing.push("Stripe customer ID");

    if (missing.length > 0) {
      setFormError(`Missing ${missing.join(", ")}.`);
      return;
    }

    const newCustomer: Customer = {
      id: Date.now(),
      name: formState.name.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      plan: formState.plan,
      stripeCustomerId: formState.stripeCustomerId.trim(),
      subscriptionStatus: formState.subscriptionStatus,
      status: "INACTIVE",
      notes: formState.notes.trim() || undefined,
      industry: formState.industry.trim() || undefined,
      address: formState.address.trim() || undefined
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setSelectedId(newCustomer.id);
    setShowForm(false);
    setFormState({
      name: "",
      email: "",
      phone: "",
      plan: "starter",
      stripeCustomerId: "",
      subscriptionStatus: "INACTIVE",
      notes: "",
      industry: "",
      address: ""
    });
    showToast("Customer added.", "success");
  };

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === id ? { ...customer, ...updates } : customer))
    );
  };

  const handleActivate = async () => {
    if (!selectedCustomer) return;
    if (!readiness?.ready) return;
    setActionLoading(true);
    try {
      const response = await fetch("/api/customers/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: selectedCustomer.id })
      });
      if (!response.ok) {
        throw new Error("Activation failed.");
      }
      updateCustomer(selectedCustomer.id, { status: "ACTIVE" });
      showToast("Customer activated successfully.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Activation failed.";
      showToast(message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    try {
      const response = await fetch("/api/customers/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: selectedCustomer.id, reason: "manual" })
      });
      if (!response.ok) {
        throw new Error("Deactivation failed.");
      }
      updateCustomer(selectedCustomer.id, { status: "TERMINATED" });
      showToast("Customer deactivated.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deactivation failed.";
      showToast(message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[1392px] flex-col gap-6 px-6 py-8">
      {toast && (
        <div className="fixed right-6 top-6 z-50">
          <Toast variant={toast.variant}>{toast.message}</Toast>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Customer Onboarding
          </h1>
          <p className="text-sm text-gray-500">
            Add customers, validate readiness, and activate safely.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close" : "Add Customer"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Add Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Business name
              </label>
              <Input
                placeholder="Acme Services Ltd"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Contact email
              </label>
              <Input
                placeholder="hello@acme.com"
                value={formState.email}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Business phone
              </label>
              <Input
                placeholder="+44 7700 900123"
                value={formState.phone}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Plan</label>
              <Select
                value={formState.plan}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    plan: event.target.value as Customer["plan"]
                  }))
                }
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Stripe customer ID
              </label>
              <Input
                placeholder="cus_123"
                value={formState.stripeCustomerId}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    stripeCustomerId: event.target.value
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Payment status
              </label>
              <Select
                value={formState.subscriptionStatus}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    subscriptionStatus: event.target.value as SubscriptionStatus
                  }))
                }
              >
                <option value="INACTIVE">Not active</option>
                <option value="ACTIVE">Active</option>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Notes</label>
              <Textarea
                placeholder="Optional notes for operators"
                value={formState.notes}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Industry</label>
              <Input
                placeholder="Trades, Clinics, Agencies"
                value={formState.industry}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    industry: event.target.value
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Address</label>
              <Input
                placeholder="Street, City"
                value={formState.address}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    address: event.target.value
                  }))
                }
              />
            </div>
            {formError && (
              <div className="md:col-span-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
            <div className="flex items-center justify-end gap-2 md:col-span-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customers.length === 0 && (
              <div className="text-sm text-gray-500">No customers yet.</div>
            )}
            {customers.map((customer) => (
              <button
                key={customer.id}
                className={`flex w-full items-center justify-between rounded-md border px-3 py-3 text-left transition ${
                  customer.id === selectedId
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setSelectedId(customer.id)}
                type="button"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {customer.name}
                  </div>
                  <div className="text-xs text-gray-500">{customer.email}</div>
                </div>
                <Badge
                  variant={
                    customer.status === "ACTIVE"
                      ? "success"
                      : customer.status === "TERMINATED"
                      ? "destructive"
                      : "default"
                  }
                >
                  {customer.status}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Customer Detail
              </CardTitle>
              {selectedCustomer && (
                <Badge
                  variant={
                    selectedCustomer.status === "ACTIVE"
                      ? "success"
                      : selectedCustomer.status === "TERMINATED"
                      ? "destructive"
                      : "default"
                  }
                >
                  {selectedCustomer.status}
                </Badge>
              )}
            </div>
            {selectedCustomer && readiness && (
              <div
                className={`rounded-md border px-3 py-2 text-sm ${
                  readiness.ready
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {readiness.ready
                  ? "Ready to activate"
                  : `Not ready — Missing ${readiness.missing[0]}`}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedCustomer && (
              <div className="text-sm text-gray-500">
                Select a customer to view details.
              </div>
            )}
            {selectedCustomer && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem label="Business name" value={selectedCustomer.name} />
                  <InfoItem label="Contact email" value={selectedCustomer.email} />
                  <InfoItem label="Business phone" value={selectedCustomer.phone} />
                  <InfoItem label="Plan" value={selectedCustomer.plan} />
                  <InfoItem
                    label="Stripe customer ID"
                    value={selectedCustomer.stripeCustomerId}
                  />
                  <InfoItem
                    label="Payment status"
                    value={selectedCustomer.subscriptionStatus}
                  />
                  <InfoItem label="Industry" value={selectedCustomer.industry ?? "—"} />
                  <InfoItem label="Address" value={selectedCustomer.address ?? "—"} />
                </div>

                {selectedCustomer.notes && (
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {selectedCustomer.notes}
                  </div>
                )}

                {readiness && (
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Activation Readiness
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {readiness.checklist.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <span className="text-gray-700">{item.label}</span>
                          <span
                            className={
                              item.ok ? "text-emerald-600" : "text-gray-400"
                            }
                          >
                            {item.ok ? "Ready" : "Missing"}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleActivate}
                    disabled={
                      actionLoading ||
                      !readiness?.ready ||
                      selectedCustomer.status === "ACTIVE"
                    }
                  >
                    Activate Customer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeactivate}
                    disabled={
                      actionLoading || selectedCustomer.status !== "ACTIVE"
                    }
                  >
                    Deactivate Customer
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
