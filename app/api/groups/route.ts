import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGroups, createGroup } from "@/lib/data";
import { createGroupSchema } from "@/lib/validation";

export async function GET() {
  const groups = await getGroups();
  return NextResponse.json(groups);
}


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to create a group." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const parseResponse = createGroupSchema.safeParse(body);
  if (!parseResponse.success) {
    return NextResponse.json(
      { error: parseResponse.error.issues[0].message },
      { status: 400 }
    );
  }

  const newGroup = await createGroup({
    ...parseResponse.data,
    ownerId: session.user.id,
  });

  return NextResponse.json(newGroup, { status: 201 });
}
