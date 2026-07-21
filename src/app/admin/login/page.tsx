"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@zedx.local");
  const [password, setPassword] = useState("zedx-admin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invalid credentials.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-xl place-items-center px-4 py-10 text-white">
      <form onSubmit={handleSubmit} className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Admin</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Sign in</h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-white/45">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none"
              placeholder="admin@zedx.local"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-white/45">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none"
              placeholder="zedx-admin"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 h-14 w-full rounded-full bg-white text-sm font-semibold uppercase tracking-[0.16em] text-[#050505] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <p className="mt-4 text-sm text-white/55">Use the local admin credentials configured in `.env`.</p>
      </form>
    </main>
  );
}
