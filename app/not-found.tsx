import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-xs text-gray-300 uppercase tracking-widest mb-6">404 Kesalahan</p>
        <h1 className="text-3xl font-medium text-gray-900 mb-3">Halaman tidak ditemukan</h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link href="/" className="inline-block bg-black text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}