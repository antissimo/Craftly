// app/explore/page.tsx
import CVCard from '@/components/CVCard';
import { Suspense } from 'react';
import LoadingGrid from '@/components/LoadingGrid';
import Pagination from '@/components/Pagination';
import { headers } from 'next/headers';

async function getCurrentUrl() {
  const headersList = await headers();
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('host') || 'localhost:3000';
  const pathname = '/api/explore'; // Your API path
  
  return `${protocol}://${host}${pathname}`;
}
async function getCVs(page: number = 1) {
  try {
    const currentUrl = await getCurrentUrl();
  const res = await fetch(`${currentUrl}?page=${page}&limit=12`, {
    cache: 'no-store',
  });
    
    console.log('API Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error response:', errorText);
      throw new Error(`API error: ${res.status} - ${errorText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error in getCVs:', error);
    throw error;
  }
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const page = (await searchParams).page ? parseInt((await searchParams).page!) : 1;
  
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

async function ExploreContent({ page }: { page: number }) {
  try {
    const data = await getCVs(page);
    const { cvs, pagination } = data;

    if (!cvs || cvs.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">
              Showing {cvs.length} of {pagination.total} portfolios
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {cvs.map((cv: any) => (
            <CVCard key={cv.id} cv={cv} />
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
            />
          </div>
        )}
      </>
    );
  } catch (error: any) {
    console.error('Error loading portfolios:', error.message);
    
    return (
      <div className="text-center py-20">
        <div className="text-red-400 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Failed to load portfolios
        </h3>
        <p className="text-gray-500 mb-4">
          {error.message || 'Please try refreshing the page'}
        </p>
        <div className="text-sm text-gray-400 space-y-2">
          <p>Troubleshooting steps:</p>
          <ol className="list-decimal list-inside text-left max-w-md mx-auto">
            <li>Check if API route exists: <code>/api/explore</code></li>
            <li>Check browser console for errors</li>
            <li>Verify database connection</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    );
  }
}