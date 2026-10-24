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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-8">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-serif text-lg font-bold">FlashMaster Admin</span>
          <span className="text-xs text-ink-soft">Signed in as {admin.email}</span>
        </div>
        <form action={adminLogoutAction}>
          <button type="submit" className="text-sm font-semibold text-again">
            Log Out
          </button>
        </form>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Users" value={userCount} />
        <Stat label="Decks" value={deckCount} />
        <Stat label="Cards" value={cardCount} />
        <Stat label="Reviews" value={reviewCount} />
        <Stat label="Premium" value={`${premiumCount} (${premiumPct}%)`} />
      </section>

      <section className="flex flex-col gap-3">
        <span className="font-serif text-base font-semibold">Users</span>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
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
                    <form action={toggleUserPremiumAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button
                        type="submit"
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          u.isPremium ? "bg-primary-soft text-primary" : "bg-surface-sunken text-ink-soft"
                        }`}
                      >
                        {u.isPremium ? "Premium" : "Free"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-2.5">
                    <form action={toggleUserAdminAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button
                        type="submit"
                        disabled={u.id === admin.id}
                        className={`rounded-full px-2.5 py-1 text-xs font-bold disabled:opacity-40 ${
                          u.isAdmin ? "bg-primary text-white" : "bg-surface-sunken text-ink-soft"
                        }`}
                      >
                        {u.isAdmin ? "Admin" : "—"}
                      </button>
                    </form>
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
    <div className="flex flex-col gap-1 rounded-2xl border border-border p-4">
      <span className="font-serif text-xl font-semibold">{value}</span>
      <span className="text-xs text-ink-soft">{label}</span>
    </div>
  );
}
