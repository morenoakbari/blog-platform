"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  _count: { followers: number; posts: number };
};

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown kalau klik di luar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setOpen(true);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      {/* Input */}
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-gray-400 transition-colors">
        <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="text-sm flex-1 focus:outline-none placeholder-gray-300 bg-transparent"
          placeholder="Cari user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && (
          <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-black rounded-full animate-spin shrink-0" />
        )}
      </div>

      {/* Dropdown Results */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-300 text-center">
              User tidak ditemukan
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username ?? user.id}`}
                  onClick={() => { setOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.username ? `@${user.username}` : ""} · {user._count.posts} posts · {user._count.followers} followers
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}