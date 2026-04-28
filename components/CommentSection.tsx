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

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setComments([data, ...comments]);
    setContent("");
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-xl font-bold mb-6">
        💬 Komentar ({comments.length})
      </h2>

      {/* Form Komentar */}
      {session ? (
        <div className="mb-6">
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows={3}
            placeholder="Tulis komentar..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Komentar"}
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>{" "}
          untuk meninggalkan komentar.
        </div>
      )}

      {/* List Komentar */}
      {comments.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}