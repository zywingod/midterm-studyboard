"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");

    const confirmed = window.confirm(
      "Delete this group and all its tasks? This cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/groups/${groupId}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to delete group.");
        setIsDeleting(false);
        return;
      }


      router.push("/groups");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="whitespace-nowrap rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete Group"}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}