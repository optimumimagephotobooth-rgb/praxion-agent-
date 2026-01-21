"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Customer } from "@/lib/api";

interface CustomerDetailProps {
  onNavigate: (view: string) => void;
  id?: string;
}

export function CustomerDetail({ onNavigate, id }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-400">
        <AlertTriangle className="h-12 w-12 text-rose-400" />
        <p className="text-lg font-medium">{error || "Customer not found."}</p>
        <Button variant="outline" onClick={() => onNavigate("list")}>
          Go back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("list")}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-slate-100">
            Customer Details
          </h1>
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Badge
              variant={
                customer.status === "ACTIVE"
                  ? "success"
                  : customer.status === "PAUSED"
                  ? "warning"
                  : "destructive"
              }
            >
              {customer.status}
            </Badge>
          </div>

          <div className="text-sm text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-100">
            Business Information
          </h3>
          <Card className="glass-card h-full">
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoRow label="Business Name" value={customer.name} />
                <InfoRow label="Email" value={customer.email} />
                <InfoRow label="Business Phone" value={customer.phone || "—"} />
                <InfoRow label="Industry" value={customer.industry || "—"} />
                <InfoRow label="Plan" value={customer.plan || "—"} />
                <InfoRow label="Address" value={customer.address || "—"} />
                <InfoRow label="Tax ID" value={customer.taxId || "—"} />
              </div>

              {customer.notes && (
                <div className="border-t border-slate-700/60 pt-4">
                  <InfoRow label="Notes" value={customer.notes} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            System Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 font-mono text-xs text-slate-400">
          <div>Customer ID: {customer.id}</div>
          <div>Created at: {customer.createdAt || new Date().toISOString()}</div>
          <div>Last event: {customer.lastEvent || "—"}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-sm text-slate-400">{label}</div>
      <div className="break-words text-base font-medium text-slate-100">
        {value}
      </div>
    </div>
  );
}

function ChecklistItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          ok
            ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
            : "border-slate-600 bg-slate-900/70 text-slate-400"
        }`}
      >
        {ok && (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-sm font-medium ${
          ok ? "text-slate-100" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
