"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          Blog Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Halo, {session?.user?.name}!</span>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
            Lihat Blog
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="flex">
        <aside className="w-56 min-h-screen bg-white shadow-sm p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm font-medium"
          >
            📊 Overview
          </Link>
          <Link
            href="/dashboard/posts"
            className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm font-medium"
          >
            📝 My Posts
          </Link>
          <Link
            href="/dashboard/posts/new"
            className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm font-medium"
          >
            ✏️ New Post
          </Link>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}