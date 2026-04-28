"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleSubmit = async (published: boolean) => {
    setLoading(true);
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published }),
    });
    router.push("/dashboard/posts");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Konten</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            💾 Simpan Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            🚀 Publish
          </button>
        </div>
      </div>
    </div>
  );
}