"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");

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
    if (!res.ok) { setError(data.error || "Terjadi kesalahan"); setLoading(false); return; }
    router.push("/dashboard/posts");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Tulisan Baru</h1>
        <p className="text-sm text-gray-400 mt-0.5">Buat dan terbitkan artikel</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Judul</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
            placeholder="Judul artikel Anda..."
            value={form.title}
            onChange={handleTitleChange}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Slug (URL)</label>
          <div className="flex flex-col sm:flex-row sm:items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition-colors">
            <span className="px-3 py-2 text-xs text-gray-300 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200">
              blog-platform/blog/
            </span>
            <input
              type="text"
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none placeholder-gray-300"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="slug-artikel"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Ringkasan (Excerpt)</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
            placeholder="Deskripsi singkat artikel..."
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Konten</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none placeholder-gray-300 leading-relaxed"
            rows={16}
            placeholder="Tulis artikel Anda di sini..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-gray-50">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-900 transition-colors order-2 sm:order-1"
          >
            Batal
          </button>
          <div className="flex gap-3 order-1 sm:order-2">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-700"
            >
              Simpan Draf
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Menerbitkan..." : "Terbitkan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}