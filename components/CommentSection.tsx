"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Comment = {
  id: string;
  content: string;
  createdAt: Date | string;
  author: { name: string | null };
};

export default function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setComments([data, ...comments]);
    setContent("");
    setLoading(false);
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-light)] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        💬 {comments.length} {comments.length === 1 ? "Komentar" : "Komentar"}
      </h2>

      {session ? (
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all resize-none text-gray-900 dark:text-white placeholder:text-gray-400"
                rows={3}
                placeholder="Bagikan pendapat Anda..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="mt-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm px-5 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 transition shadow-sm"
              >
                {loading ? "Memposting..." : "Kirim komentar →"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Masuk</Link> untuk meninggalkan komentar.
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">✨ Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold shrink-0">
                {comment.author.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}