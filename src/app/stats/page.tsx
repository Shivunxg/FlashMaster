import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BottomNav } from "@/components/bottom-nav";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default async function StatsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userCards = await db.card.findMany({
    where: { deck: { userId: user.id } },
    select: { id: true, repetitions: true },
  });
  const cardsLearned = userCards.filter((c) => c.repetitions > 0).length;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentLogs = await db.reviewLog.findMany({
    where: { reviewedAt: { gte: thirtyDaysAgo }, card: { deck: { userId: user.id } } },
    select: { grade: true, reviewedAt: true },
  });
  const retention =
    recentLogs.length > 0
      ? Math.round(
          (recentLogs.filter((l) => l.grade === "good" || l.grade === "easy").length /
            recentLogs.length) *
            100
        )
      : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekCounts = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = new Date(today);
    dayStart.setDate(today.getDate() - (6 - i));
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    return recentLogs.filter((l) => l.reviewedAt >= dayStart && l.reviewedAt < dayEnd).length;
  });
  const maxCount = Math.max(1, ...weekCounts);

  const circumference = 2 * Math.PI * 32;
  const dashOffset = circumference - (retention / 100) * circumference;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-3.5">
        <Link href="/" aria-label="Back to home" className="text-ink-soft">
          ‹
        </Link>
        <span className="font-serif text-[17px] font-semibold">Your progress</span>
        <span className="w-4" />
      </header>

      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        <div className="flex gap-7 px-0.5">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-[30px] font-semibold text-accent">{user.streak}</span>
            <span className="text-xs text-ink-soft">day streak</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col gap-1">
            <span className="font-serif text-[30px] font-semibold">{cardsLearned}</span>
            <span className="text-xs text-ink-soft">cards learned</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 border-t border-b border-border py-4">
          <span className="text-sm font-semibold">Retention rate (last 30 days)</span>
          <div className="flex items-center gap-4.5">
            <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
              <circle cx="38" cy="38" r="32" fill="none" stroke="var(--color-surface-sunken)" strokeWidth="7" />
              <circle
                cx="38"
                cy="38"
                r="32"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 38 38)"
              />
              <text x="38" y="43" textAnchor="middle" fontSize="17" fontWeight="600" fill="var(--color-ink)">
                {retention}%
              </text>
            </svg>
            <span className="text-[13px] leading-relaxed text-ink-soft">
              {recentLogs.length > 0
                ? `Based on ${recentLogs.length} reviews over the last 30 days.`
                : "Study a deck to start tracking retention."}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold">This week</span>
          <div className="flex h-16 items-end gap-2.5">
            {weekCounts.map((count, i) => (
              <div
                key={i}
                className={`fm-rise flex-1 rounded-t ${i === 6 ? "bg-accent" : "bg-primary"}`}
                style={{ height: `${Math.max(6, (count / maxCount) * 100)}%`, animationDelay: `${i * 0.04}s` }}
              />
            ))}
          </div>
          <div className="flex gap-2.5">
            {DAY_LABELS.map((label, i) => (
              <span
                key={i}
                className={`flex-1 text-center text-[10px] ${
                  i === 6 ? "font-bold text-accent" : "text-ink-soft"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {!user.isPremium && (
          <div className="flex flex-col gap-3.5 rounded-3xl bg-primary p-5.5 text-white">
            <span className="font-serif text-[17px] font-semibold">FlashMaster Premium</span>
            <div className="flex flex-col gap-2 text-[13px]">
              <span>— Unlimited decks</span>
              <span>— AI flashcards from text or PDF</span>
              <span>— Advanced stats & export</span>
              <span>— No ads</span>
            </div>
            <Link
              href="/premium"
              className="rounded-full bg-white py-3 text-center text-sm font-bold text-primary"
            >
              Upgrade — $4.99/mo · 7-day trial
            </Link>
          </div>
        )}
      </main>

      <BottomNav active="Stats" />
    </div>
  );
}
