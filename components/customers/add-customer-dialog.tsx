"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

type PlanOption = "starter" | "pro" | "enterprise";

export interface AddCustomerPayload {
  name: string;
  email: string;
  phone: string;
  plan: PlanOption;
  notes?: string;
}

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: AddCustomerPayload) => void;
}

export function AddCustomerDialog({
  open,
  onClose,
  onCreate
}: AddCustomerDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [plan, setPlan] = React.useState<PlanOption | "">("");
  const [notes, setNotes] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  if (!open) return null;

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Business name is required";
    }

    if (!email.trim() || !email.includes("@")) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!phone.trim()) {
      nextErrors.phone = "Business phone number is required";
    }

    if (!plan) {
      nextErrors.plan = "Select a plan to continue";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = Boolean(
    name.trim() && email.includes("@") && phone.trim() && plan
  );

  const showToast = (message: string, variant: "success" | "error") => {
    setToast({ message, variant });
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPlan("");
    setNotes("");
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      onCreate({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        plan: plan as PlanOption,
        notes: notes.trim() || undefined
      });
      showToast("Customer created. Status: Not ready for activation.", "success");
      setName("");
      setEmail("");
      setPhone("");
      setPlan("");
      setNotes("");
      setErrors({});
      onClose();
    } catch {
      showToast("Could not create customer. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      {toast && (
        <div className="fixed right-6 top-6 z-50">
          <Toast variant={toast.variant}>{toast.message}</Toast>
        </div>
      )}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Add Customer
          </CardTitle>
          <p className="text-sm text-gray-500">
            Create a customer account and prepare it for activation.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Business Name (required)
              </label>
              <Input
                placeholder="Acme Ltd"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Contact Email (required)
              </label>
              <p className="text-xs text-gray-500">
                Used for system notifications and account contact
              </p>
              <Input
                placeholder="contact@business.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Business Phone (required)
              </label>
              <p className="text-xs text-gray-500">
                Customer’s real business phone number (calls will be linked to this)
              </p>
              <Input
                placeholder="+44 7XXX XXXXXX"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Plan (required)
              </label>
              <Select
                value={plan}
                onChange={(event) => {
                  setPlan(event.target.value as PlanOption);
                  if (errors.plan) {
                    setErrors((prev) => ({ ...prev, plan: "" }));
                  }
                }}
              >
                <option value="" disabled>
                  Select a plan
                </option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </Select>
              {errors.plan && <p className="text-xs text-red-600">{errors.plan}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Internal Notes (optional)
            </label>
            <p className="text-xs text-gray-500">
              Staff-only notes (not visible to the customer)
            </p>
            <Textarea
              placeholder="Internal context, special handling, referrals…"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || submitting}>
              {submitting ? "Creating…" : "Create Customer"}
            </Button>
            {!isFormValid && (
              <span className="text-xs text-gray-500">Complete required fields</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
