import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { id: username }],
    },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
      followers: true,
      following: true,
    },
  });

  if (!user) notFound();

  const isOwnProfile = session?.user?.id === user.id;
  const isFollowed = !!user.followers.find((f) => f.followerId === session?.user?.id);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Back + Action */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
          >
            ← Kembali ke beranda
          </Link>

          {isOwnProfile ? (
            <Link
              href="/settings/profile"
              className="text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              Edit Profile
            </Link>
          ) : (
            <FollowButton userId={user.id} initialFollowed={isFollowed} />
          )}
        </div>

        {/* Profile Header - redesigned */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-light)] p-6 md:p-8 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">@{user.username}</p>
              {user.bio && <p className="text-gray-600 dark:text-gray-300 mt-3 text-balance">{user.bio}</p>}
              <div className="flex gap-5 mt-4 text-sm">
                <Link
                  href={`/profile/${user.username}/followers`}
                  className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{user.followers.length}</span> Followers
                </Link>
                <Link
                  href={`/profile/${user.username}/following`}
                  className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{user.following.length}</span> Following
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📝</span> Artikel yang ditulis
        </h2>
        {user.posts.length === 0 ? (
          <div className="text-center py-12 bg-[var(--card-bg)] rounded-xl border border-[var(--border-light)]">
            <p className="text-gray-400">Belum ada artikel.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-[var(--card-bg)] rounded-xl border border-[var(--border-light)] p-4 hover:shadow-md transition-all hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}