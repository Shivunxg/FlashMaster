import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createDeckAction } from "@/app/actions/decks";

const FREE_DECK_LIMIT = 3;
const COLORS = [
  { value: "pink", className: "bg-pastel-pink" },
  { value: "mint", className: "bg-pastel-mint" },
  { value: "peach", className: "bg-pastel-peach" },
  { value: "lavender", className: "bg-pastel-lavender" },
];

export default async function NewDeckPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const deckCount = await db.deck.count({ where: { userId: user.id } });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-3.5">
        <Link href="/" aria-label="Cancel" className="text-ink-soft">
          ×
        </Link>
        <span className="font-serif text-[17px] font-semibold">New Deck</span>
        <span className="w-4.5" />
      </header>

      <form action={createDeckAction} className="flex flex-1 flex-col gap-5 px-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-ink-soft">
            Deck name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Spanish Vocab A1"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-xs font-semibold text-ink-soft">
            Language or subject
          </label>
          <input
            id="subject"
            name="subject"
            placeholder="e.g. Spanish → English"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-ink-soft">Color tag</span>
          <div className="flex gap-3 pt-0.5">
            {COLORS.map((c, i) => (
              <label key={c.value} className="relative">
                <input
                  type="radio"
                  name="color"
                  value={c.value}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span
                  className={`block h-7.5 w-7.5 cursor-pointer rounded-full border-2 border-transparent peer-checked:border-ink ${c.className}`}
                />
              </label>
            ))}
          </div>
        </div>

        {deckCount >= FREE_DECK_LIMIT && (
          <div className="rounded-xl bg-primary-soft p-3.5 text-[12.5px] leading-relaxed">
            Free plan decks: <strong>{deckCount} of {FREE_DECK_LIMIT} used.</strong>{" "}
            <Link href="/premium" className="font-bold text-primary">
              Upgrade for unlimited decks →
            </Link>
          </div>
        )}

        <div className="flex-1" />

        <button
          type="submit"
          className="mb-6 rounded-full bg-primary py-3.5 text-center text-sm font-bold text-white transition active:scale-[.98]"
        >
          Create Deck
        </button>
      </form>
    </div>
  );
}
