"use client";
import { useState } from "react";

export default function FollowButton({
  userId,
  initialFollowed,
}: {
  userId: string;
  initialFollowed: boolean;
}) {
  const [followed, setFollowed] = useState(initialFollowed);

  const handleClick = async () => {
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followingId: userId }),
    });
    const data = await res.json();
    setFollowed(data.followed);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-5 py-2 rounded-full font-medium transition-all duration-200 shadow-sm ${
        followed
          ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
          : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
      }`}
    >
      {followed ? "✓ Following" : "+ Follow"}
    </button>
  );
}