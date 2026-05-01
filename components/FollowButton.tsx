"use client";

import { useState } from "react";

export default function FollowButton({
  userId,
  initialFollowed,
}: {
  userId: string;
  initialFollowed: boolean;
}) {
  const [followed, setFollowed] =
    useState(initialFollowed);

  const handleClick = async () => {
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followingId: userId,
      }),
    });

    const data = await res.json();
    setFollowed(data.followed);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-4 py-2 rounded-lg transition ${
        followed
          ? "bg-gray-100 text-gray-700"
          : "bg-black text-white"
      }`}
    >
      {followed ? "Following" : "Follow"}
    </button>
  );
}