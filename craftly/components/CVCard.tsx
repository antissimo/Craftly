// components/CVCard.tsx - MINIMAL VERSION
import Link from 'next/link';

interface CVCardProps {
  cv: {
    id: string;
    title: string;
    summary: string;
    updatedAt: string;
    userEmail: string;
    userName: string;
  };
}

export default function CVCard({ cv }: CVCardProps) {
  const getColorFromEmail = (email: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-teal-100 text-teal-800',
    ];
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Link href={`/explore/${cv.id}`} className="block h-full">
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer h-full flex flex-col">
        {/* Card Content */}
        <div className="p-6 flex-1">
          {/* User badge */}
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${getColorFromEmail(cv.userEmail)}`}>
              {cv.userName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                {cv.userName}
              </h4>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 line-clamp-2">
            {cv.title}
          </h3>

          {/* Summary */}
          <p className="text-gray-600 line-clamp-3">
            {cv.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}