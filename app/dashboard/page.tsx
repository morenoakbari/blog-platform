import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [totalPosts, publishedPosts, draftPosts, recentPosts] = await Promise.all([
    prisma.post.count({ where: { authorId: session.user.id } }),
    prisma.post.count({ where: { authorId: session.user.id, published: true } }),
    prisma.post.count({ where: { authorId: session.user.id, published: false } }),
    prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900">Good day, {session.user?.name}!</h1>
        <p className="text-sm text-gray-400 mt-1">Here's what's happening with your blog.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Posts", value: totalPosts, color: "text-gray-900" },
          { label: "Published", value: publishedPosts, color: "text-green-600" },
          { label: "Drafts", value: draftPosts, color: "text-amber-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
            <p className={`text-3xl font-medium ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900">Recent Posts</p>
          <Link href="/dashboard/posts/new" className="text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
            + New Post
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-300 mb-3">No posts yet</p>
            <Link href="/dashboard/posts/new" className="text-sm text-gray-900 underline underline-offset-2">Write your first post →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentPosts.map((post) => (
              <div key={post.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${post.published ? "bg-green-400" : "bg-amber-400"}`} />
                  <p className="text-sm text-gray-700 truncate">{post.title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-xs text-gray-300">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </p>
                  <Link href={`/dashboard/posts/${post.id}/edit`} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}