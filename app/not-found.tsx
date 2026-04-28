import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl mb-4">😕</p>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-500 mb-6">Halaman yang kamu cari tidak ditemukan.</p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}