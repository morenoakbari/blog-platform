"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Selamat datang, {session?.user?.name}! 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Posts</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Published</p>
          <p className="text-3xl font-bold mt-1 text-green-500">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Draft</p>
          <p className="text-3xl font-bold mt-1 text-yellow-500">0</p>
        </div>
      </div>

      <Link
        href="/dashboard/posts/new"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Buat Post Baru
      </Link>
    </div>
  );
}