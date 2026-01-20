"use client";

import { EnhancedButton } from "@/components/ui/EnhancedButton";
import { ProgressRingGroup } from "@/components/ui/ProgressRing";
import { StaggeredGrid, StaggeredList } from "@/components/ui/StaggeredList";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Plus,
  Settings,
  Shield,
  Upload,
  Users,
  Zap
} from "lucide-react";

export default function EnhancedDashboard() {
  const customers = [
    { id: 1, name: "Acme Heating Co.", email: "ops@acmeheating.com", status: "active" },
    { id: 2, name: "Tech Solutions Inc.", email: "info@techsolutions.com", status: "pending" },
    { id: 3, name: "Global Retail Ltd.", email: "support@globalretail.com", status: "active" },
    { id: 4, name: "Cloud Dynamics", email: "contact@clouddynamics.io", status: "inactive" }
  ];

  const progressMetrics = [
    { progress: 100, title: "Account Setup", description: "Completed", color: "#10B981" },
    { progress: 100, title: "Payment Method", description: "Verified", color: "#06B6D4" },
    { progress: 85, title: "Documents", description: "In review", color: "#8B5CF6" },
    { progress: 60, title: "Integration", description: "In progress", color: "#F59E0B" }
  ];

  const kpiMetrics = [
    { id: 1, title: "Onboarding Rate", value: "85%", change: "+12%", color: "emerald" },
    { id: 2, title: "Activation Time", value: "3.2 days", change: "-0.5 days", color: "cyan" },
    { id: 3, title: "Satisfaction", value: "94%", change: "+5%", color: "purple" },
    { id: 4, title: "Revenue", value: "$24.5K", change: "+18%", color: "emerald" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="animate-ambient-glow bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
              Customer Onboarding
            </h1>
            <p className="mt-2 text-slate-400">
              Add customers, validate readiness, and activate safely.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <EnhancedButton variant="ghost">
              <Settings className="h-4 w-4" />
              Settings
            </EnhancedButton>

            <EnhancedButton magnetic>
              <Plus className="h-4 w-4" />
              Add Customer
            </EnhancedButton>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-xl glass-card card-hover">
            <div className="p-6 pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
                Customers
              </h3>
            </div>

            <div className="p-6 pt-4">
              <StaggeredList items={customers} animationDelay={0.1}>
                {(customer) => (
                  <div className="group cursor-pointer rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900/70">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-100 group-hover:text-white">
                          {customer.name}
                        </div>
                        <div className="mt-1 text-xs text-slate-400 group-hover:text-slate-300">
                          {customer.email}
                        </div>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          customer.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : customer.status === "pending"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {customer.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
              </StaggeredList>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl glass-card card-hover">
              <div className="space-y-4 p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-100">Customer Detail</h3>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE
                  </div>
                </div>

                <div className="animate-pulse rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">
                      Ready to activate
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 pt-4">
                <div>
                  <h4 className="mb-6 text-lg font-semibold text-slate-100">
                    Activation Progress
                  </h4>
                  <ProgressRingGroup items={progressMetrics} columns={4} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <StaggeredGrid
                    items={[
                      { label: "Business name", value: "Acme Heating Co." },
                      { label: "Contact email", value: "ops@acmeheating.com" },
                      { label: "Business phone", value: "+1 (555) 010-8899" },
                      { label: "Plan", value: "Pro", highlight: true }
                    ]}
                    columns={2}
                    animationDelay={0.05}
                  >
                    {(item) => (
                      <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-4 transition-colors duration-300 hover:border-cyan-500/30">
                        <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                          {item.label}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            item.highlight ? "text-cyan-400" : "text-slate-100"
                          }`}
                        >
                          {item.value}
                        </div>
                      </div>
                    )}
                  </StaggeredGrid>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <EnhancedButton variant="primary" magnetic>
                    <Zap className="h-4 w-4" />
                    Activate Customer
                  </EnhancedButton>

                  <EnhancedButton variant="secondary" magnetic>
                    <Shield className="h-4 w-4" />
                    Deactivate Customer
                  </EnhancedButton>

                  <EnhancedButton variant="ghost">
                    <AlertCircle className="h-4 w-4" />
                    Issue Summary
                  </EnhancedButton>
                </div>
              </div>
            </div>

            <div className="rounded-xl glass-card card-hover p-6">
              <h3 className="mb-6 text-xl font-semibold text-slate-100">
                Performance Metrics
              </h3>

              <StaggeredGrid items={kpiMetrics} columns={4} animationDelay={0.1}>
                {(metric) => (
                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 transition-all duration-300 hover:border-cyan-500/30">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm text-slate-400">{metric.title}</div>
                      <div
                        className={`text-sm ${
                          metric.color === "emerald"
                            ? "text-emerald-400"
                            : metric.color === "cyan"
                              ? "text-cyan-400"
                              : "text-purple-400"
                        }`}
                      >
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          metric.color === "emerald"
                            ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                            : metric.color === "cyan"
                              ? "bg-gradient-to-r from-cyan-500 to-purple-500"
                              : "bg-gradient-to-r from-purple-500 to-emerald-500"
                        }`}
                        style={{ width: "85%" }}
                      />
                    </div>
                  </div>
                )}
              </StaggeredGrid>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <EnhancedButton variant="ghost" magnetic>
            <Users className="h-4 w-4" />
            View All Customers
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </EnhancedButton>

          <EnhancedButton variant="ghost" magnetic>
            <CreditCard className="h-4 w-4" />
            Billing Overview
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </EnhancedButton>

          <EnhancedButton variant="ghost" magnetic>
            <Upload className="h-4 w-4" />
            Export Data
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </EnhancedButton>
        </div>
      </div>

      <div className="fixed right-8 top-1/4 h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-sm animate-pulse [animation-duration:2s]" />
      <div className="fixed bottom-1/3 left-8 h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 blur-sm animate-pulse [animation-delay:1s] [animation-duration:3s]" />
    </div>
  );
}
