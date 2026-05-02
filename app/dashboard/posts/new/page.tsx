"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CoverImageUpload from "@/components/CoverImageUpload";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl h-48 flex items-center justify-center bg-[var(--card-bg)]">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  ),
});

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

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
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posting Baru</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Tulis dan terbitkan artikel</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-light)] p-6 shadow-sm space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
            Cover Image
          </label>
          <CoverImageUpload
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Judul
          </label>
          <input
            type="text"
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition dark:text-white placeholder:text-gray-400"
            placeholder="Judul artikel Anda..."
            value={form.title}
            onChange={handleTitleChange}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Slug
          </label>
          <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50">
            <span className="px-3 py-2.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              moreno.blog/blog/
            </span>
            <input
              type="text"
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-transparent dark:text-white placeholder:text-gray-400"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Cuplikan (Excerpt)
          </label>
          <input
            type="text"
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white placeholder:text-gray-400"
            placeholder="Deskripsi singkat artikel..."
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Konten
          </label>
          <RichTextEditor
            content={form.content}
            onChange={(content) => setForm({ ...form, content })}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-light)]">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
          >
            Batal
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="text-sm border border-gray-300 dark:border-gray-700 px-5 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 text-gray-700 dark:text-gray-300"
            >
              Simpan sebagai Draf
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Menerbitkan..." : "Terbitkan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}