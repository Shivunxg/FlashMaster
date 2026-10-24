import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { previewIntervals } from "@/lib/sm2";
import { StudyCard } from "@/components/study-card";
import { FlameIcon } from "@/components/icons";

export default async function StudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ total?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { deckId } = await params;
  const { total } = await searchParams;

  const deck = await db.deck.findFirst({ where: { id: deckId, userId: user.id } });
  if (!deck) notFound();

  const now = new Date();
  const remaining = await db.card.count({ where: { deckId, dueAt: { lte: now } } });

  if (remaining === 0) {
    redirect(`/study/${deckId}/complete`);
  }

  const card = await db.card.findFirst({
    where: { deckId, dueAt: { lte: now } },
    orderBy: { dueAt: "asc" },
  });
  if (!card) redirect(`/study/${deckId}/complete`);

  const sessionTotal = total ? Math.max(Number(total), remaining) : remaining;
  const reviewed = sessionTotal - remaining;
  const progressPct = sessionTotal > 0 ? Math.round((reviewed / sessionTotal) * 100) : 0;
  const intervals = previewIntervals(card);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-4 px-5 pt-6 pb-2.5">
        <Link href="/" aria-label="Close review" className="flex-shrink-0 text-ink-soft">
          ×
        </Link>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
          <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="fm-pulse flex flex-shrink-0 items-center gap-1 text-[13px] font-bold text-accent">
          <FlameIcon /> {user.streak}
        </div>
      </header>

      <p className="px-5 text-center text-[13px] font-semibold text-ink-soft">
        {remaining} card{remaining === 1 ? "" : "s"} left · {deck.name}
      </p>

      <StudyCard card={card} deckId={deckId} intervals={intervals} sessionTotal={sessionTotal} />
    </div>
  );
}
