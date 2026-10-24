import Link from "next/link";
import { signupAction } from "@/app/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-7 px-7 py-10">
      <div className="flex flex-col gap-1.5">
        <span className="font-serif text-lg font-bold">FlashMaster</span>
        <h1 className="font-serif text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-ink-soft">Start learning smarter today.</p>
      </div>

      {error === "invalid" && (
        <p className="rounded-xl bg-again/10 px-4 py-3 text-sm text-again">
          Please fill in every field — passwords need at least 8 characters.
        </p>
      )}
      {error === "exists" && (
        <p className="rounded-xl bg-again/10 px-4 py-3 text-sm text-again">
          An account with that email already exists.
        </p>
      )}

      <form action={signupAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-ink-soft">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jordan Lee"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
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
            minLength={8}
            placeholder="At least 8 characters"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary py-3.5 text-center text-sm font-bold text-white transition active:scale-[.98]"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary">
          Sign In
        </Link>
      </p>
    </main>
  );
}
