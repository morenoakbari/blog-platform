"use client";
import { useState } from "react";

export default function LikeButton({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    const data = await res.json();
    if (data.liked) {
      setLiked(true);
      setCount(count + 1);
    } else {
      setLiked(false);
      setCount(count - 1);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm active:scale-95"
    >
      <span className="text-lg transition-transform duration-100 transform active:scale-110">
        {liked ? "❤️" : "🤍"}
      </span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {count} Suka
      </span>
    </button>
  );
}