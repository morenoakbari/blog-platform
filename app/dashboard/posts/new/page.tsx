"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm({ ...form, title, slug: generateSlug(title) });
  };

  const handleSubmit = async (published: boolean) => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan");
      setLoading(false);
      return;
    }

    router.push("/dashboard/posts");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Buat Post Baru</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={handleTitleChange}
            placeholder="Judul artikel..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="judul-artikel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt (Ringkasan)</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Ringkasan singkat artikel..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Konten</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Tulis konten artikel di sini..."
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