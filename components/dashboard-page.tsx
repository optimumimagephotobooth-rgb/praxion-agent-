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
import {
  Activity,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Plus,
  Users,
  type LucideIcon
} from "lucide-react";

interface DashboardPageProps {
  onNavigate?: (view: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const router = useRouter();

  const handlePrimaryAction = () => {
    if (onNavigate) {
      onNavigate("list");
      return;
    }
    router.push("/customers");
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card cyber-border card-hover animate-fadeIn shadow-[0_12px_40px_rgba(139,92,246,0.25)]">
        <CardContent className="space-y-1 p-6">
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
            <Button onClick={handlePrimaryAction}>
              <Plus className="mr-2 h-4 w-4" />
              Manage Customers
            </Button>
            <Button variant="outline">
              View Analytics
            </Button>
            <Button variant="outline">
              Billing
            </Button>
            <Button variant="outline">
              Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card card-hover animate-fadeIn">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-100">
            System Status
          </CardTitle>
          <CardDescription>Read-only operational signals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-400">
          <StatusRow label="Automation Engine" value="Online" tone="green" />
          <StatusRow label="Event Queue" value="Healthy" tone="blue" />
          <StatusRow label="Last Deployment" value="3 hours ago" tone="emerald" />
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
    <Card className="glass-card card-hover animate-fadeIn overflow-hidden">
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
