import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshButton } from "@/components/monitoring/refresh-button";
import { getEventLog, type DomainEvent } from "@/lib/domain-events";
import { listCustomers, type CustomerState } from "@/lib/mock-customer-store";

function formatPayload(payload: DomainEvent["payload"]) {
  if (!payload) return "—";
  try {
    return JSON.stringify(payload);
  } catch {
    return "[unserializable]";
  }
}

export default function MonitoringPage() {
  const events = getEventLog().slice().reverse().slice(0, 50);
  const customers = listCustomers();

  const totals = customers.reduce(
    (acc, customer) => {
      acc.total += 1;
      if (customer.status === "ACTIVE") acc.active += 1;
      if (customer.status === "PAUSED") acc.paused += 1;
      if (customer.status === "TERMINATED") acc.terminated += 1;
      return acc;
    },
    { total: 0, active: 0, paused: 0, terminated: 0 }
  );

  return (
    <main className="mx-auto flex w-full max-w-[1392px] flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Monitoring</h1>
          <p className="text-sm text-gray-500">
            System activity, customer state, and event flow visibility.
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total customers" value={totals.total} />
        <MetricCard label="Active" value={totals.active} variant="success" />
        <MetricCard label="Paused" value={totals.paused} variant="default" />
        <MetricCard label="Terminated" value={totals.terminated} variant="destructive" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">
              Recent Domain Events
            </CardTitle>
            <p className="text-sm text-gray-500">Latest 50 events (newest first).</p>
          </div>
          <Badge variant={events.length > 0 ? "success" : "default"}>
            {events.length} events
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payload</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No events yet
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={`${event.customerId}-${event.timestamp}-${event.type}`}>
                    <TableCell className="whitespace-nowrap text-xs text-gray-500">
                      {event.timestamp}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-gray-900">
                      {event.type}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      #{event.customerId}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {formatPayload(event.payload)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Customer State Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">
                    No customers tracked yet
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="text-sm text-gray-700">
                      #{customer.id}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

function MetricCard({
  label,
  value,
  variant = "default"
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "destructive";
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-400">
            {label}
          </div>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
        </div>
        <Badge variant={variant}>{value}</Badge>
      </CardContent>
    </Card>
  );
}
