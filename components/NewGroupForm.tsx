"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function NewGroupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [memberCount, setMemberCount] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO (Step 8): Implement the submit handler.
  // 1. Prevent default submission and clear any previous error.
  // 2. POST to /api/groups with { name, subject, memberCount } as JSON.
  //    (fetch() automatically includes the NextAuth session cookie for
  //    same-origin requests — that's how the API route knows who you are.)
  // 3. If the response is not ok, show the error message from the body.
  // 4. If it succeeded, parse the created group from the response and
  //    redirect to its detail page: router.push(`/groups/${newGroup.id}`)
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subject, memberCount }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Something went wrong");
      setIsSubmitting(false);
      return;
    }

    const newGroup = await response.json();
    router.push(`/groups/${newGroup.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Group Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="memberCount" className="block text-sm font-medium">
          Member Count
        </label>
        <input
          id="memberCount"
          type="number"
          min={1}
          required
          value={memberCount}
          onChange={(e) => setMemberCount(Number(e.target.value))}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Group"}
      </Button>
    </form>
  );
}
