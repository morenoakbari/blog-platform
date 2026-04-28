import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">📝 My Blog</h1>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/dashboard"
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Posts */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Artikel Terbaru</h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-5xl mb-4">📭</p>
            <p>Belum ada artikel yang dipublish.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>✍️ {post.author.name}</span>
                  <span>•</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}