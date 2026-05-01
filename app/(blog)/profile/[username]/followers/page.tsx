import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      followers: {
        include: {
          follower: true,
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/profile/${username}`}>
            ← Kembali
          </Link>

          <h1 className="font-medium">
            Followers
          </h1>
        </div>

        <div className="space-y-4">
          {user.followers.length === 0 ? (
            <p className="text-gray-400">
              Belum ada followers.
            </p>
          ) : (
            user.followers.map((item) => (
              <Link
                key={item.id}
                href={`/profile/${item.follower.username}`}
                className="block border rounded-xl p-4 hover:bg-gray-50"
              >
                <p className="font-medium">
                  {item.follower.name}
                </p>

                <p className="text-sm text-gray-400">
                  @{item.follower.username}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}