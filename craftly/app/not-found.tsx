import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="min-h-[70vh] bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          The page you are looking for does not exist, was moved, or the URL may be typed incorrectly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-slate-900 px-6 py-2.5 font-medium text-white transition hover:bg-slate-700"
          >
            Go to Home
          </Link>
          <Link
            href="/explore?page=1"
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Explore Portfolios
          </Link>
          <Link
            href="/my-portfolio"
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            My Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
