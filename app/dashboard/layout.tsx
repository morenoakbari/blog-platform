"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Ringkasan" },
  { href: "/dashboard/posts", label: "Artikel Saya" },
  { href: "/dashboard/posts/new", label: "Tulisan Baru" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-semibold">B</span>
            </div>
            <span className="font-medium text-gray-900 text-sm">blog-platform</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-900 transition-colors whitespace-nowrap">
              Lihat Blog →
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar - responsive: di mobile jadi horizontal scroll atau flex row wrap? Dibuat grid sederhana */}
        <aside className="w-full md:w-44 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap md:whitespace-normal ${
                    isActive
                      ? "bg-black text-white font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}