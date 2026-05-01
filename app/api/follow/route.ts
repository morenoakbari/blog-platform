import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { followingId } = await req.json();

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId,
      },
    },
  });

  // unfollow
  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    });

    return NextResponse.json({ followed: false });
  }

  // follow
  await prisma.follow.create({
    data: {
      followerId: session.user.id,
      followingId,
    },
  });

  return NextResponse.json({ followed: true });
}