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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="text-sm flex-1 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="Cari user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-up">
          {results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-400 text-center">User tidak ditemukan</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {results.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username ?? user.id}`}
                  onClick={() => { setOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{user.username} · {user._count.posts} postingan · {user._count.followers} pengikut
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