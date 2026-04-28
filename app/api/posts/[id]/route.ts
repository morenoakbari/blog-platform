import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.post.delete({
        where: { id: params.id },
    });

    return NextResponse.json({ message: "Post deleted" });
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content, excerpt, slug, published } = await req.json();

    const post = await prisma.post.update({
        where: { id: params.id },
        data: { title, content, excerpt, slug, published },
    });

    return NextResponse.json(post);
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    });

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(post);
}