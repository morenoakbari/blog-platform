export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import SearchUser from "@/components/SearchUser";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, include: { author: true } });
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt || post.content.slice(0, 160) };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, categories: true, likes: true, comments: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!post || !post.published) notFound();
  const readingTime = Math.ceil(post.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navbar dengan search responsif */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group self-start sm:self-auto">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">blog-platform</span>
          </Link>

          <div className="w-full sm:flex-1 sm:max-w-md">
            <SearchUser />
          </div>

          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition self-end sm:self-auto">
            ← Kembali
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {post.categories.map((cat) => (
              <span key={cat.id} className="text-[11px] sm:text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2.5 sm:px-3 py-1 rounded-full">
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-6 sm:mt-8 pb-6 sm:pb-8 border-b border-[var(--border-light)] mb-6 sm:mb-8">
          <Link href={`/profile/${(post.author as any).username ?? post.author.id}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold hover:scale-105 transition">
              {post.author.name?.charAt(0).toUpperCase()}
            </div>
          </Link>
          <div>
            <Link href={`/profile/${(post.author as any).username ?? post.author.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 transition">
              {post.author.name}
            </Link>
            <div className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · {readingTime} menit baca
            </div>
          </div>
        </div>

        {post.coverImage && (
          <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-10 shadow-md">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover max-h-96" />
          </div>
        )}

        <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
        <LikeButton postId={post.id} initialCount={post.likes.length} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-16">
        <CommentSection postId={post.id} initialComments={post.comments} />
      </div>
    </div>
  );
}