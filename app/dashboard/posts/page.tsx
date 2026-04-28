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
    fetch("/api/posts").then((r) => r.json()).then((d) => { setPosts(d); setLoading(false); });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">My Posts</h1>
          <p className="text-sm text-gray-400 mt-0.5">{posts.length} total posts</p>
        </div>
        <Link href="/dashboard/posts/new" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          + New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-300 mb-3">No posts yet</p>
            <Link href="/dashboard/posts/new" className="text-sm text-gray-900 underline underline-offset-2">Write your first post →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.map((post) => (
              <div key={post.id} className="px-5 py-4 flex items-center gap-4">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${post.published ? "bg-green-400" : "bg-amber-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-300 mt-0.5">/{post.slug}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  post.published ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <p className="text-xs text-gray-300 shrink-0 hidden sm:block">
                  {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/dashboard/posts/${post.id}/edit`} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className="text-xs text-red-300 hover:text-red-500 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}