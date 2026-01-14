import CVCard from '@/components/CVCard';
import { Suspense } from 'react';
import LoadingGrid from '@/components/LoadingGrid';
import { headers } from 'next/headers';

/* ----------------------------------------
   Helpers
---------------------------------------- */

async function getCurrentUrl() {
  const headersList = await headers();
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('host') || 'localhost:3000';

  return `${protocol}://${host}/api/explore`;
}

async function getCVs(page: number = 1) {
  const currentUrl = await getCurrentUrl();

  const res = await fetch(`${currentUrl}?page=${page}&limit=12`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

/* ----------------------------------------
   Page
---------------------------------------- */

export default async function ExplorePage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Portfolios
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse public portfolios shared by creatives worldwide.
          </p>
        </div>

        <Suspense fallback={<LoadingGrid />}>
          <ExploreContent page={page} />
        </Suspense>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Content
---------------------------------------- */

async function ExploreContent({ page }: { page: number }) {
  try {
    const data = await getCVs(page);
    const { cvs, pagination } = data;

    if (!cvs || cvs.length === 0) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No portfolios found
          </h3>
          <p className="text-gray-500">
            There are no portfolios to display at the moment.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Meta */}
        <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
          <span>
            Showing {cvs.length} of {pagination.total} portfolios
          </span>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {cvs.map((cv: any) => (
            <CVCard key={cv.id} cv={cv} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            {/* Previous */}
            {pagination.page > 1 ? (
              <a
                href={`/explore?page=${pagination.page - 1}`}
                className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                ← Previous
              </a>
            ) : (
              <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
                ← Previous
              </span>
            )}

            {/* Page Info */}
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            {/* Next */}
            {pagination.page < pagination.totalPages ? (
              <a
                href={`/explore?page=${pagination.page + 1}`}
                className="px-4 py-2 rounded-md border bg-white text-gray-700 hover:bg-gray-100 transition"
              >
                Next →
              </a>
            ) : (
              <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
                Next →
              </span>
            )}
          </div>
        )}
      </>
    );
  } catch (error: any) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Failed to load portfolios
        </h3>
        <p className="text-gray-500">
          {error.message || 'Please refresh the page'}
        </p>
      </div>
    );
  }
}
