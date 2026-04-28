"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`).then((r) => r.json()).then((d) => { setForm(d); setFetching(false); });
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

  if (fetching) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Edit Post</h1>
        <p className="text-sm text-gray-400 mt-0.5">Update your article</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Slug</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition-colors">
            <span className="px-3 py-2.5 text-xs text-gray-300 bg-gray-50 border-r border-gray-200">moreno.blog/blog/</span>
            <input
              type="text"
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Excerpt</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Content</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none leading-relaxed"
            rows={16}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${form.published ? "bg-green-400" : "bg-amber-400"}`} />
            <span className="text-xs text-gray-400">{form.published ? "Published" : "Draft"}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-700"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Update & Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}