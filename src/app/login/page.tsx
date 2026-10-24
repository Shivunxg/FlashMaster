import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-7 px-7 py-10">
      <div className="flex flex-col gap-1.5">
        <span className="font-serif text-lg font-bold">FlashMaster</span>
        <h1 className="font-serif text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-ink-soft">Pick up where you left off.</p>
      </div>

      {error === "invalid" && (
        <p className="rounded-xl bg-again/10 px-4 py-3 text-sm text-again">
          That email or password doesn&apos;t match an account.
        </p>
      )}

      <form action={loginAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-ink-soft">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-ink-soft">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary py-3.5 text-center text-sm font-bold text-white transition active:scale-[.98]"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold text-primary">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
