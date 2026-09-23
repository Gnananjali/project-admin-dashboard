"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-ink-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="font-semibold text-ink-900">
          Product Admin
        </Link>

        {user && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-ink-500">Signed in as {user.username}</span>
            <button
              onClick={logout}
              className="rounded-md border border-ink-100 px-3 py-1.5 font-medium text-ink-700 hover:bg-ink-50"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
