"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CoverImageUpload from "@/components/CoverImageUpload";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-lg h-48 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
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
    if (!res.ok) { setError(data.error || "Something went wrong"); setLoading(false); return; }
    router.push("/dashboard/posts");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">New Post</h1>
        <p className="text-sm text-gray-400 mt-0.5">Write and publish your article</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        {/* Cover Image */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Cover Image</label>
          <CoverImageUpload
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
            placeholder="Your article title..."
            value={form.title}
            onChange={handleTitleChange}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Slug</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition-colors">
            <span className="px-3 py-2.5 text-xs text-gray-300 bg-gray-50 border-r border-gray-200">
              moreno.blog/blog/
            </span>
            <input
              type="text"
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none placeholder-gray-300"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Excerpt</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
            placeholder="Short description of your article..."
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Content</label>
          <RichTextEditor
            content={form.content}
            onChange={(content) => setForm({ ...form, content })}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-700"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}