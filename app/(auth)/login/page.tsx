"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (res?.error) { setError("Email atau password salah."); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-semibold">B</span>
          </div>
          <h1 className="text-xl font-medium text-gray-900">Selamat datang kembali</h1>
          <p className="text-sm text-gray-400 mt-1">Masuk ke akun Anda</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                placeholder="anda@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Kata sandi</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                suppressHydrationWarning
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? "Memasukkan..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-gray-900 underline underline-offset-2">Daftar</Link>
        </p>
      </div>
    </div>
  );
}