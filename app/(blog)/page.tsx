export const revalidate = 0;

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SearchUser from "@/components/SearchUser";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true, categories: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navbar - Responsif dengan flex column di mobile */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group self-start sm:self-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
              blog<span className="text-indigo-500">.</span>platform
            </span>
          </Link>

          {/* Search - FULL LEBAR DI HP, sedang di desktop */}
          <div className="w-full sm:flex-1 sm:max-w-md">
            <SearchUser />
          </div>

          {/* Link kanan */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:inline-block">
              Artikel
            </Link>
            {session?.user && (
              <Link
                href={`/profile/${(session.user as any).username ?? session.user.id}`}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                Profile
              </Link>
            )}
            <Link
              href="/dashboard"
              className="text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm whitespace-nowrap"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section - redesigned */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <p className="text-indigo-500 text-sm font-mono mb-3 tracking-wider">✦ LATEST ARTICLES</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              Ide, pemikiran<br />
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">& tutorial.</span>
            </h1>
          </div>
          <div className="h-1 w-12 bg-indigo-500/30 rounded-full md:hidden mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 max-w-md text-balance text-sm sm:text-base">
            Jelajahi artikel terbaru dari komunitas penulis kreatif.
          </p>
        </div>
      </div>

      {/* Posts List - Card style modern */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-black/30 rounded-2xl backdrop-blur-sm border border-[var(--border-light)]">
            <p className="text-5xl sm:text-6xl mb-4">📭</p>
            <p className="text-gray-400 text-sm sm:text-base">Belum ada artikel yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-[var(--card-bg)] rounded-xl sm:rounded-2xl border border-[var(--border-light)] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  {post.coverImage && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-5">
                    {post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        {post.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat.id}
                            className="text-[11px] sm:text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2 sm:px-2.5 py-1 rounded-full"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-[var(--border-light)] mt-2 flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                  <span className="whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <Link
                    href={`/profile/${(post.author as any).username ?? post.author.id}`}
                    className="hover:text-indigo-500 transition flex items-center gap-1 truncate max-w-[60%] sm:max-w-full"
                  >
                    <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 inline-flex items-center justify-center text-[10px] font-bold shrink-0">
                      {post.author.name?.charAt(0)}
                    </span>
                    <span className="truncate">{post.author.name}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-light)] py-6 sm:py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 order-2 sm:order-1">© 2026 blog-platform — share your story</p>
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition order-1 sm:order-2">
            Admin dashboard →
          </Link>
        </div>
      </footer>
    </div>
  );
}