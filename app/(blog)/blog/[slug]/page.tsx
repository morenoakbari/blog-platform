import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post || !post.published) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            📝 My Blog
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
            ← Kembali
          </Link>
        </div>
      </header>

      {/* Article */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <article className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-6 border-b">
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

          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>

        {/* Comment Section */}
        <CommentSection postId={post.id} initialComments={post.comments} />
      </main>
    </div>
  );
}