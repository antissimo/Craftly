// components/LoadingGrid.tsx
export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="p-6 pb-4">
            {/* User skeleton */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="ml-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
            
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            
            {/* Summary skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
          
          {/* Footer skeleton */}
          <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}