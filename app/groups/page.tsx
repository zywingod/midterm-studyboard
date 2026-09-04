import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GroupCard from "@/components/GroupCard";
import { getGroups } from "@/lib/data";

// TODO (Step 16): Only show the "+ New Group" link to logged-in visitors.
// 1. This is a Server Component, so you can check the session directly:
//    const session = await getServerSession(authOptions);
// 2. Wrap the <Link href="/groups/new"> below in {session && ( ... )}.
export default async function GroupsPage() {
  const [groups, session] = await Promise.all([
    getGroups(),
    getServerSession(authOptions),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Groups</h1>
        {session && 
          <Link
            href="/groups/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Group
        </Link>
        }  
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
