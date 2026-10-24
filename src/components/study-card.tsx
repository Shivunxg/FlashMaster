"use client";

import { useState } from "react";
import type { Card } from "@prisma/client";
import { reviewCardAction } from "@/app/actions/study";

const GRADES = [
  { value: "again", label: "Again", className: "bg-again" },
  { value: "hard", label: "Hard", className: "bg-hard" },
  { value: "good", label: "Good", className: "bg-good" },
  { value: "easy", label: "Easy", className: "bg-easy" },
] as const;

export function StudyCard({
  card,
  deckId,
  intervals,
  sessionTotal,
}: {
  card: Card;
  deckId: string;
  intervals: Record<"again" | "hard" | "good" | "easy", string>;
  sessionTotal: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <div className="flex flex-1 items-center justify-center p-5">
        <div className="fm-flip-outer w-full max-w-sm cursor-pointer" onClick={() => setFlipped((f) => !f)}>
          <div className={`fm-flip-inner min-h-75 ${flipped ? "is-flipped" : ""}`}>
            <div className="fm-flip-face flex min-h-75 flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface p-7 text-center">
              <span className="text-[11px] font-bold tracking-wide text-ink-soft">PROMPT</span>
              <span className="font-serif text-3xl font-semibold">{card.front}</span>
              <span className="mt-2.5 text-[12.5px] text-ink-soft">Tap the card to reveal the answer</span>
            </div>

            <div className="fm-flip-face fm-flip-back flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wide text-primary">ANSWER</span>
                <span className="text-xs text-ink-soft">{card.front}</span>
              </div>
              <span className="font-serif text-2xl font-semibold">{card.back}</span>
              {card.example && (
                <>
                  <div className="h-px bg-border" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-ink-soft">Example</span>
                    <span className="text-sm leading-relaxed">{card.example}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <form action={reviewCardAction} className="flex flex-col gap-2.5 px-5 pb-6">
        <input type="hidden" name="cardId" value={card.id} />
        <input type="hidden" name="deckId" value={deckId} />
        <input type="hidden" name="total" value={sessionTotal} />
        <span className="text-center text-xs text-ink-soft">How well did you know this?</span>
        <div className="flex gap-2">
          {GRADES.map((g) => (
            <button
              key={g.value}
              type="submit"
              name="grade"
              value={g.value}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-full py-2.5 text-sm font-bold text-white transition active:scale-95 ${g.className}`}
            >
              {g.label}
              <span className="text-[11px] font-semibold opacity-85">{intervals[g.value]}</span>
            </button>
          ))}
        </div>
      </form>
    </>
  );
}
