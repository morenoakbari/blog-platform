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
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {comments.length} {comments.length === 1 ? "Komentar" : "Komentar"}
      </h2>

      {session ? (
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-medium">
                {session.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none text-gray-900 placeholder-gray-300"
                rows={3}
                placeholder="Tulis pendapat Anda..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="mt-2 bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                {loading ? "Memposting..." : "Kirim komentar"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-10 p-4 border border-gray-100 rounded-lg">
          <p className="text-sm text-gray-400">
            <Link href="/login" className="text-gray-900 underline underline-offset-2">Masuk</Link> untuk meninggalkan komentar.
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-gray-300">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex flex-col sm:flex-row gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-gray-600 text-xs font-medium">
                  {comment.author.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                  <span className="text-xs text-gray-300">
                    {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed break-words">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}