import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { StatusBadge, type CustomerStatus } from "@/components/status-badge";
import { ActionButtons } from "@/components/action-buttons";
import { Skeleton } from "@/components/ui/skeleton";

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: CustomerStatus;
  lastActive: string;
}

interface CustomerTableProps {
  title: string;
  description: string;
  customers: Customer[];
}

export function CustomerTable({
  title,
  description,
  customers
}: CustomerTableProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <h1 className="text-figma-h1 font-semibold text-slate-900">{title}</h1>
        <p className="text-figma-body text-slate-500">{description}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-slate-900">
                  {customer.name}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.plan}</TableCell>
                <TableCell>
                  <StatusBadge status={customer.status} />
                </TableCell>
                <TableCell>{customer.lastActive}</TableCell>
                <TableCell className="text-right">
                  <ActionButtons />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function CustomerTableSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
