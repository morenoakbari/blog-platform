import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      following: {
        include: {
          following: true,
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
            Following
          </h1>
        </div>

        <div className="space-y-4">
          {user.following.length === 0 ? (
            <p className="text-gray-400">
              Belum follow siapa pun.
            </p>
          ) : (
            user.following.map((item) => (
              <Link
                key={item.id}
                href={`/profile/${item.following.username}`}
                className="block border rounded-xl p-4 hover:bg-gray-50"
              >
                <p className="font-medium">
                  {item.following.name}
                </p>

                <p className="text-sm text-gray-400">
                  @{item.following.username}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}