"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function submit() {
    setSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/account/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(isSignup ? { name, email, phone, password } : { email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? "Unable to continue.");
      router.push("/account");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to continue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-[92rem] place-items-center px-4 py-28 text-white sm:px-8">
      <motion.section
        className="grid w-full overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] shadow-2xl shadow-black/35 lg:grid-cols-[0.9fr_1.1fr]"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 24 }}
      >
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_24%_20%,rgba(0,160,227,0.28),transparent_34%),linear-gradient(135deg,#071015,#050505)] p-8 sm:p-12">
          <div className="pointer-events-none absolute -bottom-24 -right-20 size-72 rounded-full bg-[var(--brand-blue)]/18 blur-3xl" />
          <p className="relative text-xs font-semibold text-[var(--brand-blue-soft)]">
            ZEDX account
          </p>
          <h1 className="relative mt-5 max-w-xl text-5xl font-semibold leading-[0.9] tracking-normal sm:text-7xl">
            {isSignup ? "Create your premium setup profile." : "Welcome back to your setup."}
          </h1>
          <p className="relative mt-6 max-w-lg text-base leading-7 text-white/66">
            Save delivery details, review orders, and keep your ZEDX shopping flow ready for the next purchase.
          </p>
          <div className="relative mt-10 grid gap-3 text-sm text-white/72">
            <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <ShieldCheck size={18} className="text-[var(--brand-blue-soft)]" />
              Local secure session for this demo store.
            </span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <UserPlus size={18} className="text-[var(--brand-blue-soft)]" />
              Account, delivery profile, and order history in one place.
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <p className="text-xs font-semibold text-white/42">
            {isSignup ? "Create account" : "Sign in"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            {isSignup ? "Start with your details." : "Enter your login details."}
          </h2>

          <div className="mt-8 grid gap-4">
            {isSignup ? <Field label="Full name" value={name} onChange={setName} /> : null}
            <Field label="Email address" value={email} onChange={setEmail} type="email" />
            {isSignup ? <Field label="Phone number" value={phone} onChange={setPhone} /> : null}
            <Field label="Password" value={password} onChange={setPassword} type="password" />
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--brand-blue)] text-sm font-semibold text-white shadow-2xl shadow-[var(--brand-blue)]/20 transition hover:bg-white hover:text-[#050505] disabled:opacity-65"
          >
            {submitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            <ArrowRight size={17} />
          </button>

          {status ? (
            <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
              {status}
            </p>
          ) : null}

          <p className="mt-7 text-center text-sm text-white/58">
            {isSignup ? "Already have an account?" : "New to ZEDX?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold text-[var(--brand-blue-soft)] hover:text-white"
            >
              {isSignup ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}

function Field({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/44">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="mt-2 h-14 w-full rounded-2xl border border-white/12 bg-black/24 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-[var(--brand-blue)]"
        placeholder={label}
      />
    </label>
  );
}
