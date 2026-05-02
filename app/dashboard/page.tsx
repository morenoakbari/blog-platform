export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [totalPosts, publishedPosts, draftPosts, recentPosts] = await Promise.all([
    prisma.post.count({ where: { authorId: session.user.id } }),
    prisma.post.count({ where: { authorId: session.user.id, published: true } }),
    prisma.post.count({ where: { authorId: session.user.id, published: false } }),
    prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Halo, {session.user?.name}!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ringkasan aktivitas blog Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Total Artikel", value: totalPosts, color: "text-gray-900 dark:text-white" },
          { label: "Terbit", value: publishedPosts, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Draf", value: draftPosts, color: "text-amber-600 dark:text-amber-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-light)] p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              {stat.label}
            </p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--border-light)] flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">📄 Artikel Terbaru</h2>
          <Link
            href="/dashboard/posts/new"
            className="text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm"
          >
            + Tulisan Baru
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Belum ada artikel</p>
            <Link
              href="/dashboard/posts/new"
              className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Tulis artikel pertama →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-light)]">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      post.published ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {post.title}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-xs">
                  <span className="text-gray-400 dark:text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <Link
                    href={`/dashboard/posts/${post.id}/edit`}
                    className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}