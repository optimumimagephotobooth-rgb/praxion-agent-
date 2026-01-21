"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3, CreditCard, Plus, Users, type LucideIcon } from "lucide-react";
import { N8nGlassCard, N8nPipeline, N8nStatusIndicator } from "@/components/n8n";
import { MagneticButton, ProgressRingGroup, RippleButton } from "@/components/effects";

interface DashboardPageProps {
  onNavigate?: (view: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const router = useRouter();
  const [actionStatus, setActionStatus] = React.useState<string | null>(null);
  const [isBusy, setIsBusy] = React.useState(false);
  const customerId = 1;
  const testPhone = "+15550108899";

  const handlePrimaryAction = () => {
    if (onNavigate) {
      onNavigate("list");
      return;
    }
    router.push("/customers");
  };

  const callApi = async (
    label: string,
    input: { url: string; method?: "GET" | "POST"; body?: Record<string, unknown> }
  ) => {
    setIsBusy(true);
    setActionStatus(`${label}...`);
    try {
      const res = await fetch(input.url, {
        method: input.method ?? "POST",
        headers: input.body ? { "Content-Type": "application/json" } : undefined,
        body: input.body ? JSON.stringify(input.body) : undefined
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? data?.reason ?? "Request failed");
      }
      setActionStatus(`${label} ✓`);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setActionStatus(`${label} ✕ (${message})`);
      throw err;
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute -top-16 left-6 h-44 w-44 rounded-full bg-gradient-to-r from-purple-600/10 to-cyan-600/10 blur-3xl animate-ambient-glow" />
      <div className="pointer-events-none absolute right-6 top-40 h-56 w-56 rounded-full bg-gradient-to-r from-cyan-600/10 to-purple-600/10 blur-3xl animate-ambient-glow [animation-delay:1000ms]" />

      <Card className="glass-card cyber-border card-hover animate-gentle-pulse relative overflow-hidden shadow-[0_12px_40px_rgba(139,92,246,0.25)]">
        <div className="pointer-events-none absolute inset-0 gradient-animate opacity-15" />
        <CardContent className="relative z-10 space-y-1 p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <SignalDot tone="green" />
            Live system status
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
            Operations Dashboard
          </h2>
          <p className="text-sm text-slate-400">
            Live system status and customer activity
          </p>
        </CardContent>
      </Card>

      {actionStatus && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
          {actionStatus}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Registered Customers"
          value="1,248"
          change="+12.5% from last month"
          icon={Users}
          tone="blue"
        />
        <StatsCard
          title="Active Automations"
          value="892"
          change="+8.2% from last month"
          icon={Activity}
          tone="green"
        />
        <StatsCard
          title="Processed Revenue"
          value="$42,580"
          change="+15.3% from last month"
          icon={CreditCard}
          tone="blue"
        />
        <StatsCard
          title="System Health"
          value="94.2%"
          change="+2.1% from last month"
          icon={BarChart3}
          tone="emerald"
        />
      </div>

      <Card className="glass-card card-hover animate-fadeIn">
        <CardHeader className="border-b border-slate-700/60 pb-4">
          <CardTitle className="text-lg font-semibold text-slate-100">
            Quick Actions
          </CardTitle>
          <CardDescription>Primary commands and system tools</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <RippleButton onClick={handlePrimaryAction} className="px-5 py-2.5">
              <Plus className="h-4 w-4" />
              Manage Customers
            </RippleButton>
            <MagneticButton
              variant="secondary"
              className="px-4 py-2"
              disabled={isBusy}
              onClick={() =>
                callApi("View analytics", {
                  url: "/api/events",
                  body: {
                    type: "ANALYTICS_VIEWED",
                    customerId,
                    timestamp: new Date().toISOString()
                  }
                })
              }
            >
              View Analytics
            </MagneticButton>
            <Button
              variant="outline"
              disabled={isBusy}
              onClick={() =>
                callApi("Send billing SMS", {
                  url: "/api/sms/execute",
                  body: {
                    customerId: String(customerId),
                    to: testPhone,
                    template: "BOOKING_LINK",
                    context: { bookingUrl: "https://example.com/billing" }
                  }
                })
              }
            >
              Billing
            </Button>
            <MagneticButton
              variant="ghost"
              className="px-4 py-2"
              disabled={isBusy}
              onClick={() =>
                callApi("Run report", {
                  url: "/api/events",
                  body: {
                    type: "REPORTS_REQUESTED",
                    customerId,
                    timestamp: new Date().toISOString()
                  }
                })
              }
            >
              Reports
            </MagneticButton>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card card-hover animate-fadeIn">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-100">
              System Status
            </CardTitle>
            <N8nStatusIndicator status="active" />
          </div>
          <CardDescription>Read-only operational signals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-400">
          <StatusRow label="Automation Engine" value="Online" tone="green" />
          <StatusRow label="Event Queue" value="Healthy" tone="blue" />
          <StatusRow label="Last Deployment" value="3 hours ago" tone="emerald" />
        </CardContent>
      </Card>

      <N8nGlassCard intensity="medium">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Automation Pipeline</h3>
            <p className="text-sm text-slate-400">
              Live orchestration snapshot across core workflow stages.
            </p>
          </div>
          <N8nStatusIndicator status="processing" />
        </div>
        <N8nPipeline
          steps={[
            { id: "input", title: "Input", status: "Receiving", active: true, icon: "📥" },
            { id: "process", title: "Process", status: "Transforming", active: true, icon: "⚙️" },
            { id: "validate", title: "Validate", status: "Pending", active: false, icon: "✅" },
            { id: "output", title: "Output", status: "Ready", active: false, icon: "📤" }
          ]}
        />
      </N8nGlassCard>

      <Card className="glass-card card-hover animate-fadeIn">
        <CardHeader className="border-b border-slate-700/60 pb-4">
          <CardTitle className="text-lg font-semibold text-slate-100">
            Readiness Metrics
          </CardTitle>
          <CardDescription>Live onboarding preparation signals.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ProgressRingGroup
            columns={3}
            rings={[
              {
                title: "Customer Readiness",
                description: "Overall preparation score",
                progress: 86,
                variant: "success",
                size: 140,
                label: "Ready",
                icon: Users
              },
              {
                title: "Payment Success",
                description: "Successful transaction rate",
                progress: 92,
                variant: "success",
                size: 140,
                label: "Healthy",
                icon: CreditCard
              },
              {
                title: "Documentation",
                description: "Compliance completeness",
                progress: 64,
                variant: "warning",
                size: 140,
                label: "In review",
                action: "View Details",
                icon: Activity
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  tone
}: {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "emerald";
}) {
  const toneClasses = {
    blue: "border-primary/60 bg-primary/15 text-primary",
    green: "border-success/60 bg-success/15 text-success",
    emerald: "border-emerald/60 bg-emerald/15 text-emerald"
  };

  return (
    <Card className="glass-card card-hover animate-fadeIn overflow-hidden floating-card card-3d">
      <div className={`h-0.5 w-full ${toneClasses[tone].split(" ")[0]}`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-md border ${toneClasses[tone]}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-100">
          {value}
        </div>
        <p className="mt-1 text-xs font-medium text-slate-400">{change}</p>
      </CardContent>
    </Card>
  );
}

function StatusRow({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "green" | "blue" | "emerald";
}) {
  return (
    <div className="border-transition flex items-center justify-between rounded-md border border-slate-700/60 bg-slate-900/60 px-3 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="flex items-center gap-2 font-medium text-slate-200">
        <SignalDot tone={tone} />
        {value}
      </span>
    </div>
  );
}

function SignalDot({ tone }: { tone: "green" | "blue" | "emerald" }) {
  const tones = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500"
  };

  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${tones[tone]}`}
      />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${tones[tone]}`} />
    </span>
  );
}
