import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ZEDX for premium tech accessories and product support.",
};

export default function ContactPage() {
  return (
    <main className="relative mx-auto grid w-full max-w-7xl flex-1 gap-10 px-5 py-20 text-white sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="pointer-events-none absolute right-10 top-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#00a0e3]/12 blur-3xl" />
      <div>
        <p className="text-xs font-semibold text-cyan-200/80">
          Contact
        </p>
        <h1 className="mt-4 text-6xl font-semibold leading-[0.86] text-white sm:text-8xl">
          Let&apos;s build the next drop.
        </h1>
      </div>
      <form className="glass-panel grid gap-5 rounded-[2rem] p-8 shadow-2xl shadow-black/30">
        <input
          className="h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60"
          placeholder="Name"
        />
        <input
          className="h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60"
          placeholder="Email"
        />
        <textarea
          className="min-h-36 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60"
          placeholder="Message"
        />
        <button className="h-14 rounded-full bg-white px-7 text-sm font-semibold text-[#050505] transition hover:scale-[1.02] hover:bg-[var(--brand-blue-soft)]">
          Send
        </button>
      </form>
    </main>
  );
}
