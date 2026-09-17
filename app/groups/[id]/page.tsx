import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getGroupById } from "@/lib/data";
import { authOptions } from "@/lib/auth";
import DeleteGroupButton from "@/components/DeleteGroupButton";
import NewTaskForm from "@/components/NewTaskForm";
import TaskItem from "@/components/TaskItem";

export default async function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [group, session] = await Promise.all([
    getGroupById(params.id),
    getServerSession(authOptions),
  ]);


  if (!group) {
    notFound();
  }

  const isOwner = session?.user.id === group.ownerId;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-gray-500">
            {group.subject} · {group.memberCount} members · Created by{" "}
            {group.owner.name}
          </p>
        </div>
        {isOwner && <DeleteGroupButton groupId={group.id} />}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        {isOwner && <NewTaskForm groupId={group.id} />}
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {group.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            groupId={group.id}
            isOwner={isOwner}
          />
        ))}
      </ul>
    </div>
  );
}