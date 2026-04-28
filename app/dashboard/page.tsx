import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
    prisma.post.count({ where: { authorId: session.user.id } }),
    prisma.post.count({ where: { authorId: session.user.id, published: true } }),
    prisma.post.count({ where: { authorId: session.user.id, published: false } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Selamat datang, {session?.user?.name}! 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Posts</p>
          <p className="text-3xl font-bold mt-1">{totalPosts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Published</p>
          <p className="text-3xl font-bold mt-1 text-green-500">{publishedPosts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">Draft</p>
          <p className="text-3xl font-bold mt-1 text-yellow-500">{draftPosts}</p>
        </div>
      </div>

      <Link
        href="/dashboard/posts/new"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Buat Post Baru
      </Link>
    </div>
  );
}