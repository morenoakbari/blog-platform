import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Email sudah terdaftar" },
      { status: 400 }
    );
  }

  // Ambil username dari email
  let baseUsername = email.split("@")[0].toLowerCase();

  // Hilangkan karakter aneh
  baseUsername = baseUsername.replace(/[^a-z0-9_]/g, "");

  let username = baseUsername;
  let counter = 1;

  // Cek kalau username sudah dipakai
  while (
    await prisma.user.findUnique({
      where: { username },
    })
  ) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      username,
    },
  });

  return NextResponse.json({
    message: "Berhasil daftar!",
    userId: user.id,
    username: user.username,
  });
}