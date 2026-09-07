import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";


export async function POST(request: Request) {
  const body = await request.json();

  const parseResponse = registerSchema.safeParse(body);
  if (!parseResponse.success) {
    return NextResponse.json(
      { error: parseResponse.error.issues[0].message },
      { status: 400 }
    )
  }

  const { name, email, password } = parseResponse.data;
  
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return NextResponse.json(
      { error: "A user with that email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const User = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(
    { id: User.id, name: User.name, email: User.email },
    { status: 201 }
  );
}
