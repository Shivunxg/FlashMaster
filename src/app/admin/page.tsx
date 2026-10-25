import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminLogoutAction, toggleUserPremiumAction, toggleUserAdminAction } from "@/app/actions/admin";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [userCount, deckCount, cardCount, reviewCount, premiumCount, users] = await Promise.all([
    db.user.count(),
    db.deck.count(),
    db.card.count(),
    db.reviewLog.count(),
    db.user.count({ where: { isPremium: true } }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { decks: true } } },
    }),
  ]);

  const premiumPct = userCount > 0 ? Math.round((premiumCount / userCount) * 100) : 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-serif text-lg font-bold">FlashMaster Admin</span>
          <span className="truncate text-xs text-ink-soft">Signed in as {admin.email}</span>
        </div>
        <form action={adminLogoutAction} className="flex-shrink-0">
          <button type="submit" className="text-sm font-semibold text-again">
            Log Out
          </button>
        </form>
      </header>

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-3">
        <Stat label="Users" value={userCount} />
        <Stat label="Decks" value={deckCount} />
        <Stat label="Cards" value={cardCount} />
        <Stat label="Reviews" value={reviewCount} />
        <Stat label="Premium" value={`${premiumCount} (${premiumPct}%)`} />
      </section>

      <section className="flex flex-col gap-3">
        <span className="font-serif text-base font-semibold">Users</span>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-2.5 sm:hidden">
          {users.map((u) => (
            <div key={u.id} className="flex flex-col gap-2.5 rounded-2xl border border-border p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold">{u.name}</span>
                  <span className="truncate text-xs text-ink-soft">{u.email}</span>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <PremiumToggle userId={u.id} isPremium={u.isPremium} />
                  <AdminToggle userId={u.id} isAdmin={u.isAdmin} disabled={u.id === admin.id} />
                </div>
              </div>
              <div className="flex gap-4 text-xs text-ink-soft">
                <span>{u._count.decks} decks</span>
                <span>{u.streak} day streak</span>
                <span>
                  Joined{" "}
                  {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto rounded-2xl border border-border sm:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-xs text-ink-soft">
                <th className="px-4 py-2.5 font-semibold">Name</th>
                <th className="px-4 py-2.5 font-semibold">Email</th>
                <th className="px-4 py-2.5 font-semibold">Decks</th>
                <th className="px-4 py-2.5 font-semibold">Streak</th>
                <th className="px-4 py-2.5 font-semibold">Joined</th>
                <th className="px-4 py-2.5 font-semibold">Premium</th>
                <th className="px-4 py-2.5 font-semibold">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-none">
                  <td className="px-4 py-2.5">{u.name}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{u.email}</td>
                  <td className="px-4 py-2.5">{u._count.decks}</td>
                  <td className="px-4 py-2.5">{u.streak}</td>
                  <td className="px-4 py-2.5 text-ink-soft">
                    {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5">
                    <PremiumToggle userId={u.id} isPremium={u.isPremium} />
                  </td>
                  <td className="px-4 py-2.5">
                    <AdminToggle userId={u.id} isAdmin={u.isAdmin} disabled={u.id === admin.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border p-3 sm:p-4">
      <span className="font-serif text-lg font-semibold sm:text-xl">{value}</span>
      <span className="text-[11px] text-ink-soft sm:text-xs">{label}</span>
    </div>
  );
}

function PremiumToggle({ userId, isPremium }: { userId: string; isPremium: boolean }) {
  return (
    <form action={toggleUserPremiumAction}>
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
          isPremium ? "bg-primary-soft text-primary" : "bg-surface-sunken text-ink-soft"
        }`}
      >
        {isPremium ? "Premium" : "Free"}
      </button>
    </form>
  );
}

function AdminToggle({
  userId,
  isAdmin,
  disabled,
}: {
  userId: string;
  isAdmin: boolean;
  disabled: boolean;
}) {
  return (
    <form action={toggleUserAdminAction}>
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={disabled}
        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold disabled:opacity-40 ${
          isAdmin ? "bg-primary text-white" : "bg-surface-sunken text-ink-soft"
        }`}
      >
        {isAdmin ? "Admin" : "—"}
      </button>
    </form>
  );
}
