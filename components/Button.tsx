import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

// A plain presentational component — no "use client" needed here.
// It can be rendered from a Server Component (static button) or from
// a Client Component (with an onClick handler attached), since Next.js
// bundles it appropriately depending on where it's used.
export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}