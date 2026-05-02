"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => {
        setPosts(d);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Artikel Saya</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Total {posts.length} artikel</p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm"
        >
          + Tulisan Baru
        </Link>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-sm">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
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
            {posts.map((post) => (
              <div
                key={post.id}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      post.published ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      /blog/{post.slug}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.published
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {post.published ? "Terbit" : "Draf"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-400 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}