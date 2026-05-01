"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setSaved("Profile berhasil diupdate ✅");

      // Redirect ke username baru
      router.push(`/profile/${data.username}`);
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-gray-900">
            Edit Profile
          </h1>

          <Link
            href={`/profile/${form.username}`}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Kembali
          </Link>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-500">
              Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-500">
              Username
            </label>

            <input
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .replace(/[^a-z0-9_]/g, ""),
                })
              }
              className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-500">
              Bio
            </label>

            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
              className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {saved && (
            <p className="text-sm text-green-600">
              {saved}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}