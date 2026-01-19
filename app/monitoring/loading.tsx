export default function MonitoringLoading() {
  return (
    <main className="mx-auto w-full max-w-[1392px] px-6 py-8">
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-md bg-slate-200" />
        <div className="h-48 w-full animate-pulse rounded-md bg-slate-200" />
        <div className="h-48 w-full animate-pulse rounded-md bg-slate-200" />
      </div>
    </main>
  );
}
