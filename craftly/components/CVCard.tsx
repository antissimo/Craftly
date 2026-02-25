import Link from "next/link";

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

function formatUpdatedDate(updatedAt: string) {
  const parsedDate = new Date(updatedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently updated";
  }

  return `Updated ${parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export default function CVCard({ cv }: CVCardProps) {
  return (
    <Link href={`/explore/${cv.id}`} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-5 flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200 font-semibold"
            >
              {cv.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 transition group-hover:text-cyan-700">
                {cv.userName}
              </h4>
              <p className="text-xs text-slate-500">{formatUpdatedDate(cv.updatedAt)}</p>
            </div>
          </div>

          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900 transition group-hover:text-cyan-700">
            {cv.title}
          </h3>

          <p className="line-clamp-4 text-sm leading-6 text-slate-600">{cv.summary}</p>

          <div className="mt-6 border-t border-slate-100 pt-4 text-sm font-medium text-cyan-700">
            Open portfolio
          </div>
        </div>
      </article>
    </Link>
  );
}
