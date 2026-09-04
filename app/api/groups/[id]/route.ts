import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGroupById, updateGroup, deleteGroup } from "@/lib/data";

// GET /api/groups/:id — read one group. Stays PUBLIC — no changes needed.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const group = await getGroupById(params.id);

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

// TODO (Step 13): PATCH /api/groups/:id — partially update a group.
// Requires authentication AND ownership: only the group's owner may edit it.
//
// 1. Get the session. If none, return 401.
// 2. Fetch the group with getGroupById(params.id). If not found, return 404.
// 3. THIS IS THE ROLE-BASED ACCESS CONTROL CHECK: if group.ownerId !==
//    session.user.id, return 403 — being logged in isn't enough, you must
//    be THIS group's owner.
// 4. Otherwise, parse the body and call updateGroup(params.id, body).
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const group = await getGroupById(params.id);

  if (!group) {
    return NextResponse.json(
      { error: "Group not found" }, 
      { status: 404 }
    );
  }

  if (group.ownerId !== session.user.id) {
    return NextResponse.json(
      { error: "Only the owner can modify this group" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const updated = await updateGroup(params.id, body);

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// TODO (Step 13): DELETE /api/groups/:id — same auth + ownership pattern as PATCH.
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  const group = await getGroupById(params.id);

  if (!group) {
    return NextResponse.json(
      { error: "Group not found" }, 
      { status: 404 }
    );
  }

  if (group.ownerId !== session.user.id) {
    return NextResponse.json(
      { error: "Only the owner can delete this group" },
      { status: 403 }
    );
  }

  const deleted = await deleteGroup(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Group deleted" });
}
