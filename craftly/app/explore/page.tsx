import CVCard from "@/components/CVCard";
import ExploreSearchForm from "@/components/ExploreSearchForm";
import LoadingGrid from "@/components/LoadingGrid";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

type SearchParams = { page?: string; q?: string };

type ExplorePageProps = {
  searchParams?: Promise<SearchParams>;
};

type CV = {
  id: string;
  title: string;
  summary: string;
  updatedAt: string;
  userEmail: string;
  userName: string;
};

type ExploreResponse = {
  cvs: CV[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
};

export const metadata: Metadata = {
  title: "Explore Portfolios",
  description:
    "Browse public creative portfolios, search by keywords, and discover recent work published on Craftly.",
  alternates: {
    canonical: "/explore",
  },
};

async function getCurrentUrl() {
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";

  return `${protocol}://${host}/api/explore`;
}

async function getCVs(page = 1, query = ""): Promise<ExploreResponse> {
  const currentUrl = await getCurrentUrl();
  const params = new URLSearchParams({
    page: String(page),
    limit: "12",
  });
  if (query.trim()) {
    params.set("q", query.trim());
  }

  const res = await fetch(`${currentUrl}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const page = resolvedSearchParams?.page
    ? Number.parseInt(resolvedSearchParams.page, 10)
    : 1;
  const query = (resolvedSearchParams?.q || "").trim();

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">
            Discover
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Explore creative portfolios
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Browse recent public profiles and open the full portfolio in one click.
          </p>

          <ExploreSearchForm initialQuery={query} />
        </div>

        <Suspense fallback={<LoadingGrid />}>
          <ExploreContent page={Number.isNaN(page) || page < 1 ? 1 : page} query={query} />
        </Suspense>
      </div>
    </section>
  );
}

function pageHref(page: number, query: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (query) {
    params.set("q", query);
  }
  return `/explore?${params.toString()}`;
}

async function ExploreContent({ page, query }: { page: number; query: string }) {
  try {
    const data = await getCVs(page, query);
    const { cvs, pagination } = data;

    if (!cvs || cvs.length === 0) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-slate-700">No portfolios found</h3>
          <p className="mt-2 text-slate-500">
            No results for "{query || "your search"}". Try another keyword.
          </p>
          {query ? (
            <div className="mt-6">
              <Link
                href="/explore?page=1"
                className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Clear search and show all
              </Link>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <>
        <div className="mb-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {cvs.length} of {pagination.total} portfolios
          </span>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cvs.map((cv) => (
            <CVCard key={cv.id} cv={cv} />
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
            {pagination.page > 1 ? (
              <Link
                href={pageHref(pagination.page - 1, query)}
                className="w-full rounded-md border border-slate-300 px-5 py-2 text-center font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Previous
              </Link>
            ) : (
              <span className="w-full cursor-not-allowed rounded-md bg-slate-100 px-5 py-2 text-center text-slate-400 sm:w-auto">
                Previous
              </span>
            )}

            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            {pagination.page < pagination.totalPages ? (
              <Link
                href={pageHref(pagination.page + 1, query)}
                className="w-full rounded-md bg-slate-900 px-5 py-2 text-center font-medium text-white transition hover:bg-slate-700 sm:w-auto"
              >
                Next
              </Link>
            ) : (
              <span className="w-full cursor-not-allowed rounded-md bg-slate-100 px-5 py-2 text-center text-slate-400 sm:w-auto">
                Next
              </span>
            )}
          </div>
        )}
      </>
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Please refresh the page";

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-14 text-center">
        <h3 className="text-xl font-semibold text-red-700">Failed to load portfolios</h3>
        <p className="mt-2 text-red-600">{message}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={pageHref(page, query)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try again
          </Link>
          <Link
            href="/explore?page=1"
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            Go to first page
          </Link>
        </div>
        <p className="mt-3 text-sm text-red-600">
          If this keeps happening, check your connection and refresh the page.
        </p>
      </div>
    );
  }
}
