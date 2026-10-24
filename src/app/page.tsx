import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BottomNav } from "@/components/bottom-nav";
import { FlameIcon, CheckIcon } from "@/components/icons";

const FREE_DECK_LIMIT = 3;
const DECK_COLORS: Record<string, string> = {
  pink: "bg-pastel-pink",
  mint: "bg-pastel-mint",
  peach: "bg-pastel-peach",
  lavender: "bg-pastel-lavender",
};

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const decks = await db.deck.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { cards: true } } },
  });

  const now = new Date();
  const decksWithDue = await Promise.all(
    decks.map(async (deck) => {
      const due = await db.card.count({ where: { deckId: deck.id, dueAt: { lte: now } } });
      return { ...deck, due };
    })
  );

  const totalDue = decksWithDue.reduce((sum, d) => sum + d.due, 0);
  const firstDeckWithDue = decksWithDue.find((d) => d.due > 0);
  const atDeckLimit = !user.isPremium && decks.length >= FREE_DECK_LIMIT;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-3.5">
        <span className="font-serif text-xl font-bold">FlashMaster</span>
        <div className="flex items-center gap-4">
          <div className="fm-pulse flex items-center gap-1 text-sm font-bold text-accent">
            <FlameIcon /> {user.streak}
          </div>
          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4.5 overflow-y-auto px-5 pb-5">
        {totalDue > 0 && firstDeckWithDue ? (
          <Link
            href={`/study/${firstDeckWithDue.id}`}
            className="flex items-center justify-between rounded-3xl bg-primary p-5 text-white transition active:scale-[.98]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[12.5px] tracking-wide opacity-80">TODAY&apos;S REVIEW</span>
              <span className="font-serif text-xl font-semibold">{totalDue} cards due</span>
              <span className="text-[13px] opacity-80">About {Math.max(1, Math.round(totalDue / 3))} minutes</span>
            </div>
            <div className="flex h-11.5 w-11.5 flex-shrink-0 items-center justify-center rounded-full border border-white/45">
              →
            </div>
          </Link>
        ) : (
          <div className="rounded-3xl border border-border bg-surface p-5 text-center text-sm text-ink-soft">
            Nothing due right now — nice work. Add a deck or come back later.
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-serif text-[17px] font-semibold">Your decks</span>
          <Link
            href="/decks/new"
            aria-label="Add a new deck"
            className="flex h-7.5 w-7.5 items-center justify-center rounded-full border border-border text-ink"
          >
            +
          </Link>
        </div>

        <div className="flex flex-col">
          {decksWithDue.map((deck) => {
            const mastered =
              deck._count.cards === 0
                ? 0
                : Math.round(((deck._count.cards - deck.due) / deck._count.cards) * 100);
            return (
              <Link
                key={deck.id}
                href={deck.due > 0 ? `/study/${deck.id}` : `/decks/${deck.id}/cards/new`}
                className="flex items-center gap-3.5 border-b border-border py-3.5 last:border-none"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-serif text-base font-bold text-ink ${
                    DECK_COLORS[deck.color] ?? "bg-pastel-pink"
                  }`}
                >
                  {deck.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="text-[14.5px] font-semibold">{deck.name}</span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className="fm-progress-fill h-full bg-primary"
                      style={{ width: `${mastered}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-soft">
                    {deck._count.cards} cards · {mastered}% mastered
                  </span>
                </div>
                {deck.due > 0 ? (
                  <span className="flex-shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
                    {deck.due}
                  </span>
                ) : (
                  <CheckIcon className="flex-shrink-0 text-primary" />
                )}
              </Link>
            );
          })}

          {atDeckLimit && (
            <Link
              href="/premium"
              className="flex items-center gap-3.5 border-b border-border py-3.5 opacity-60 last:border-none"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ink-soft font-serif text-base font-bold text-white">
                +
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[14.5px] font-semibold">Add another deck</span>
                <span className="text-xs text-ink-soft">Upgrade to add a 4th deck</span>
              </div>
            </Link>
          )}

          {decks.length === 0 && (
            <Link
              href="/decks/new"
              className="rounded-3xl border border-dashed border-border py-8 text-center text-sm text-ink-soft"
            >
              Create your first deck to get started →
            </Link>
          )}
        </div>
      </main>

      {!user.isPremium && (
        <Link
          href="/premium"
          className="flex items-center justify-between gap-3 bg-primary-soft px-5 py-3.5"
        >
          <span className="text-[12.5px]">
            <strong>Free plan</strong> — {decks.length} of {FREE_DECK_LIMIT} decks used
          </span>
          <span className="text-[12.5px] font-bold text-primary">Upgrade →</span>
        </Link>
      )}

      <BottomNav active="Home" />
    </div>
  );
}
