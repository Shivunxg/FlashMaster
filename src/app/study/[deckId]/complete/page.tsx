import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckIcon } from "@/components/icons";

export default async function SessionCompletePage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { deckId } = await params;
  const deck = await db.deck.findFirst({ where: { id: deckId, userId: user.id } });
  if (!deck) notFound();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const logs = await db.reviewLog.findMany({
    where: { reviewedAt: { gte: startOfDay }, card: { deckId } },
  });

  const counts = { again: 0, hard: 0, good: 0, easy: 0 } as Record<string, number>;
  for (const log of logs) counts[log.grade] = (counts[log.grade] ?? 0) + 1;
  const total = logs.length || 1;
  const retention = Math.round(((counts.good + counts.easy) / total) * 100);
  const xp = logs.length * 15;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <CheckIcon className="text-white" />
        </div>
        <span className="mt-1 font-serif text-2xl font-semibold">Session complete</span>
        <span className="text-[13.5px] text-ink-soft">
          {deck.name} · {logs.length} card{logs.length === 1 ? "" : "s"} reviewed
        </span>

        <div className="flex gap-7 py-3.5">
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-2xl font-semibold">{logs.length ? retention : "—"}%</span>
            <span className="text-[11.5px] text-ink-soft">retention</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-2xl font-semibold text-accent">{user.streak}</span>
            <span className="text-[11.5px] text-ink-soft">day streak</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-2xl font-semibold">+{xp}</span>
            <span className="text-[11.5px] text-ink-soft">XP</span>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="flex w-full flex-col gap-2 text-left">
            <span className="text-xs font-semibold text-ink-soft">How you did</span>
            <div className="flex h-2.5 overflow-hidden rounded-full" aria-hidden="true">
              <div className="bg-again" style={{ width: `${(counts.again / total) * 100}%` }} />
              <div className="bg-hard" style={{ width: `${(counts.hard / total) * 100}%` }} />
              <div className="bg-good" style={{ width: `${(counts.good / total) * 100}%` }} />
              <div className="bg-easy" style={{ width: `${(counts.easy / total) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-ink-soft">
              <span>Again {counts.again}</span>
              <span>Hard {counts.hard}</span>
              <span>Good {counts.good}</span>
              <span>Easy {counts.easy}</span>
            </div>
          </div>
        )}
      </main>

      <div className="flex flex-col gap-2.5 px-5 pb-6">
        <Link
          href="/"
          className="rounded-full bg-primary py-3.5 text-center text-sm font-bold text-white transition active:scale-[.98]"
        >
          Back to Home
        </Link>
        <Link href="/" className="py-2 text-center text-[13.5px] font-bold text-ink-soft">
          Study another deck
        </Link>
      </div>
    </div>
  );
}
