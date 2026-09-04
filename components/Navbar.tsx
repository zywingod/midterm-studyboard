"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/groups", label: "Groups" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg">StudyBoard</span>
        <div className="flex gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "font-semibold text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }
              >
                {link.label}
              </Link>
            );
          })}
          {status === "authenticated" && (
            <Link
              href="/groups/new"
              className={
                pathname === "/groups/new"
                  ? "font-semibold text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              New Group
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {status === "authenticated" ? (
          <>
            <span className="text-gray-600">Hello, {session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-600 hover:text-blue-600"
            >
              Sign Out
            </button>
          </>
        ) 
        : 
        (
          <>
            <Link href="/login" className="text-gray-600 hover:text-blue-600">
              Log In
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
