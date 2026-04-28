import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });
  if (!post) return { title: "Postingan tidak ditemukan" };
  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      type: "article",
      authors: [post.author.name || "Anonim"],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      categories: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post || !post.published) notFound();

  const readingTime = Math.ceil(post.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-semibold">B</span>
            </div>
            <span className="font-medium text-gray-900">blog-platform</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Kembali
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.categories.map((cat) => (
              <span key={cat.id} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 leading-snug mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 pb-8 border-b border-gray-100 mb-8">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {post.author.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
              })} · {readingTime} menit baca
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
          {post.content}
        </div>
      </article>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="border-t border-gray-100" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-20">
        <CommentSection postId={post.id} initialComments={post.comments} />
      </div>
    </div>
  );
}