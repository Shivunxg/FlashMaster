import { adminLoginAction } from "@/app/actions/admin";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-7 bg-primary px-6 text-white">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-serif text-lg font-bold">FlashMaster</span>
        <h1 className="font-serif text-2xl font-semibold">Admin</h1>
      </div>

      {error === "invalid" && (
        <p className="w-full max-w-xs rounded-xl bg-white/10 px-4 py-3 text-center text-sm">
          Incorrect email or password.
        </p>
      )}
      {error === "unauthorized" && (
        <p className="w-full max-w-xs rounded-xl bg-white/10 px-4 py-3 text-center text-sm">
          That account doesn&apos;t have admin access.
        </p>
      )}

      <form action={adminLoginAction} className="flex w-full max-w-xs flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-white/70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="rounded-xl border border-white/20 bg-white/5 px-3.5 py-3 text-sm text-white outline-none focus:border-white/50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-white/70">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-xl border border-white/20 bg-white/5 px-3.5 py-3 text-sm text-white outline-none focus:border-white/50"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-white py-3.5 text-center text-sm font-bold text-primary transition active:scale-[.98]"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
