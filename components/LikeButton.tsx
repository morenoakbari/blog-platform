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
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
    });

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
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span className="text-sm">{count} Likes</span>
    </button>
  );
}