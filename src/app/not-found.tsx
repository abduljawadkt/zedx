import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-5 text-center text-white">
      <div>
        <p className="text-sm font-semibold text-[var(--brand-blue-soft)]">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found.</h1>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#050505]"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
