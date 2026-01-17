"use client";

export default function GlobalError() {
  return (
    <main className="mx-auto w-full max-w-[1392px] px-6 py-8">
      <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-gray-600">
        Please refresh the page or try again in a few minutes.
      </p>
    </main>
  );
}
