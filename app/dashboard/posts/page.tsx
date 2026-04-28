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
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus post ini?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Belum ada post. <Link href="/dashboard/posts/new" className="text-blue-600">Buat sekarang!</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-500">
              <tr>
                <th className="px-6 py-3">Judul</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}