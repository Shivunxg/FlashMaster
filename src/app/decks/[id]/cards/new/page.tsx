import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCardAction } from "@/app/actions/decks";

export default async function NewCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const deck = await db.deck.findFirst({
    where: { id, userId: user.id },
    include: { _count: { select: { cards: true } } },
  });
  if (!deck) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-3.5">
        <Link href="/" aria-label="Done adding cards" className="text-ink-soft">
          ×
        </Link>
        <span className="font-serif text-[17px] font-semibold">{deck.name}</span>
        <span className="fm-pulse rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
          {deck._count.cards}
        </span>
      </header>

      <form action={createCardAction} className="flex flex-1 flex-col gap-5 px-5">
        <input type="hidden" name="deckId" value={deck.id} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="front" className="text-xs font-semibold text-ink-soft">
            Front <span className="font-normal text-ink-soft">(the prompt)</span>
          </label>
          <textarea
            id="front"
            name="front"
            required
            rows={3}
            placeholder="efímero"
            className="resize-none rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="back" className="text-xs font-semibold text-ink-soft">
            Back <span className="font-normal text-ink-soft">(the answer)</span>
          </label>
          <textarea
            id="back"
            name="back"
            required
            rows={3}
            placeholder="Ephemeral"
            className="resize-none rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="example" className="text-xs font-semibold text-ink-soft">
            Example sentence <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id="example"
            name="example"
            rows={2}
            placeholder="Las modas efímeras desaparecen tan rápido como llegan."
            className="resize-none rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex-1" />

        <div className="mb-6 flex flex-col gap-2.5">
          <button
            type="submit"
            name="intent"
            value="another"
            className="rounded-full bg-primary py-3.5 text-center text-sm font-bold text-white transition active:scale-[.98]"
          >
            Save & Add Another
          </button>
          <button
            type="submit"
            name="intent"
            value="done"
            className="rounded-xl py-2 text-center text-[13.5px] font-bold text-ink-soft"
          >
            Done — back to Home
          </button>
        </div>
      </form>
    </div>
  );
}
