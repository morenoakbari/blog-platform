import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true, categories: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-semibold">B</span>
            </div>
            <span className="font-medium text-gray-900">blog-platform</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Articles</Link>
            <Link href="/dashboard" className="text-sm bg-black text-white px-4 py-1.5 rounded-md hover:bg-gray-800 transition-colors">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Latest Articles</p>
        <h1 className="text-4xl font-medium text-gray-900 leading-tight">
          Thoughts, ideas<br />& tutorials.
        </h1>
      </div>

      {/* Posts List */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400">Belum ada artikel yang dipublish.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex justify-between items-start gap-8 py-6 hover:opacity-70 transition-opacity"
              >
                <div className="flex-1 min-w-0">
                  {post.categories.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {post.categories.map((cat) => (
                        <span key={cat.id} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="font-medium text-gray-900 mb-1.5 leading-snug group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </p>
                  {post.excerpt && (
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">{post.author.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
          <p className="text-xs text-gray-400">© 2026 blog-platform</p>
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
            Admin →
          </Link>
        </div>
      </footer>
    </div>
  );
}