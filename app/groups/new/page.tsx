import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NewGroupForm from "@/components/NewGroupForm";
import { redirect } from "next/navigation";
// TODO (Step 7): import redirect from "next/navigation"

// TODO (Step 7): Protect this page — it should only be reachable by
// logged-in users.
// 1. Get the session with await getServerSession(authOptions).
// 2. If there is no session, call redirect("/login") BEFORE returning
//    any JSX. Since this is a Server Component, this happens before any
//    HTML is sent to the browser — an unauthenticated visitor never
//    even sees the form flash on screen.
export default async function NewGroupPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold">Create a New Group</h1>
      <div className="mt-6">
        <NewGroupForm />
      </div>
    </div>
  );
}
