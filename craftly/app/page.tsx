"use client";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/react"; // note the 'react' import


export default function HomePage() {
  return (
    <section className="min-h-screen bg-white flex flex-col items-center px-6 py-16">
      {/* Hero section */}
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Craftly
        </h1>
        {/* <p className="text-gray-700 text-lg">
          Manage your creative journey, showcase your projects, and make your
          portfolio stand out — all in one place.
        </p> */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/explore"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Explore Portfolios
          </Link>
          <Link
            href="/my-portfolio"
            className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            My Portfolio
          </Link>
        </div>
      </div>

      
            <Analytics /> {/* This will automatically track pageviews */}

    </section>
  );
}
