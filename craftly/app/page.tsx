import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Craftly home page with a quick overview, key features, and direct access to explore portfolios.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/50 px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700">
          Creative portfolio workspace
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Build a portfolio people remember
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Craftly helps you publish your work clearly, showcase your strengths,
            and share one polished portfolio link.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/explore"
            className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Explore Portfolios
          </Link>
          <Link
            href="/my-portfolio"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            My Portfolio
          </Link>
        </div>

        <div className="mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-medium text-slate-500">Fast Setup</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Under 5 min</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-medium text-slate-500">Layouts</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Clean and responsive</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-medium text-slate-500">Sharing</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Single public link</p>
          </div>
        </div>
      </div>

      <Analytics />
    </section>
  );
}
