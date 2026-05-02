import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🔍</div>
        <p className="text-xs text-indigo-500 font-mono tracking-widest mb-4">404 ERROR</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}