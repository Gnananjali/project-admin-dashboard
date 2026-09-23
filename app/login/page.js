"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    // Prevents a fast double-click on "Log in" from firing two requests.
    if (submitting) return;

    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/products");
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-ink-900">Product Admin</h1>
        <p className="mt-1 text-sm text-ink-500">Log in to manage the product catalog.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink-700">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md border border-ink-100 px-3 py-2 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
              placeholder="emilys"
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-ink-100 px-3 py-2 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
              placeholder="emilyspass"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="text-sm text-bad">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-dark disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
