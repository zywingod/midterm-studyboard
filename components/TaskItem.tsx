"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/lib/data";

export default function TaskItem({
  task,
  groupId,
  isOwner,
}: {
  task: Task;
  groupId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [done, setDone] = useState(task.done);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    if (!isOwner) return;

    const previous = done;
    const next = !done;

    setDone(next); 
    setError("");

    try {
      const res = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: next }),
      });

      if (!res.ok) {
        setDone(previous); 
        setError("Failed to update task.");
      }
    } catch {
      setDone(previous);
      setError("Failed to update task.");
    }
  }

  async function handleDelete() {
    if (!isOwner) return;

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Failed to delete task.");
        setIsDeleting(false);
        return;
      }

  
      router.refresh();
    } catch {
      setError("Failed to delete task.");
      setIsDeleting(false);
    }
  }

  return (
    <li className="rounded-md border px-3 py-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={done}
          onChange={handleToggle}
          disabled={!isOwner || isDeleting}
          className="h-4 w-4 disabled:opacity-50"
        />
        <span className={`flex-1 ${done ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </span>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </li>
  );
}