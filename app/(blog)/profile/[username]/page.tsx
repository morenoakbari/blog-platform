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

  const user = await prisma.user.findUnique({
    where: { username },
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

  const isFollowed = !!user.followers.find(
    (f) => f.followerId === session?.user?.id
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Kembali
          </Link>

          {isOwnProfile ? (
            <Link
              href="/settings/profile"
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Edit Profile
            </Link>
          ) : (
            <FollowButton
              userId={user.id}
              initialFollowed={isFollowed}
            />
          )}
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-medium shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-medium text-gray-900">
              {user.name}
            </h1>

            <p className="text-sm text-gray-400">
              @{user.username}
            </p>

            {user.bio && (
              <p className="text-sm text-gray-600 mt-1">
                {user.bio}
              </p>
            )}

            <p className="text-sm text-gray-400 mt-2">
              {user.followers.length} Followers ·{" "}
              {user.following.length} Following
            </p>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {user.posts.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Belum ada artikel.
            </p>
          ) : (
            user.posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
              >
                <h2 className="font-medium text-gray-900">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-gray-400 mt-1">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}