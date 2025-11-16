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
        <p className="text-gray-700 text-lg">
          Manage your creative journey, showcase your projects, and make your
          portfolio stand out — all in one place.
        </p>
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

      {/* Features / Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Create Portfolio</h2>
          <p className="text-gray-600 mb-4">
            Build a personalized portfolio to showcase your skills and projects.
          </p>
          <Link
            href="/my-portfolio/add-project"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Add a Project →
          </Link>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-600 mb-4">
            Track the performance of your portfolio and see who’s viewing your work.
          </p>
          <Link
            href="/my-portfolio/analytics"
            className="text-indigo-600 font-semibold hover:underline"
          >
            View Analytics →
          </Link>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Resources</h2>
          <p className="text-gray-600 mb-4">
            Access tutorials, templates, and FAQs to help you build an amazing portfolio.
          </p>
          <Link
            href="/resources"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Explore Resources →
          </Link>
        </div>
      </div>
            <Analytics /> {/* This will automatically track pageviews */}

    </section>
  );
}
