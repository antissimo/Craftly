"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ExploreSearchFormProps = {
  initialQuery: string;
};

function hrefForQuery(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return "/explore?page=1";

  const params = new URLSearchParams({ page: "1", q: trimmed });
  return `/explore?${params.toString()}`;
}

export default function ExploreSearchForm({ initialQuery }: ExploreSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
    setIsSearching(false);
  }, [initialQuery]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearching(true);
    router.push(hrefForQuery(query));
  };

  const onClear = () => {
    if (!query.trim()) return;
    setQuery("");
    setIsSearching(true);
    router.push("/explore?page=1");
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, summary, or email..."
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-cyan-200 transition focus:ring-2"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={isSearching || !query.trim()}
        className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Clear
      </button>
    </form>
  );
}
