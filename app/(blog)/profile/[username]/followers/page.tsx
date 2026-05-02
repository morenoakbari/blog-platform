import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { id: username }],
    },
    include: {
      followers: {
        include: { follower: true },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/profile/${user.username ?? user.id}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Kembali
          </Link>
          <h1 className="font-medium">Followers ({user.followers.length})</h1>
        </div>

        <div className="space-y-3">
          {user.followers.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada followers.</p>
          ) : (
            user.followers.map((item) => (
              <Link
                key={item.id}
                href={`/profile/${item.follower.username ?? item.follower.id}`}
                className="flex items-center gap-3 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-medium">
                    {item.follower.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{item.follower.name}</p>
                  <p className="text-xs text-gray-400">
                    {item.follower.username ? `@${item.follower.username}` : ""}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}