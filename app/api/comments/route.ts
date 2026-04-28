import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Login dulu untuk berkomentar!" }, { status: 401 });
  }

  const { content, postId } = await req.json();

  if (!content.trim()) {
    return NextResponse.json({ error: "Komentar tidak boleh kosong" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      post: { connect: { id: postId } },
      author: { connect: { id: session.user.id } },
    },
    include: { author: true },
  });

  return NextResponse.json(comment);
}