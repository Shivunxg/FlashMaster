"use client";

import { useState } from "react";

export function PremiumPlanToggle() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const isYearly = plan === "yearly";

  return (
    <>
      <div className="flex gap-1 rounded-2xl bg-surface-sunken p-1">
        <button
          type="button"
          onClick={() => setPlan("monthly")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition ${
            !isYearly ? "bg-surface text-ink" : "text-ink-soft"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setPlan("yearly")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition ${
            isYearly ? "bg-surface text-ink" : "text-ink-soft"
          }`}
        >
          Yearly — save 33%
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border-[1.5px] border-primary bg-primary-soft p-5">
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-lg font-semibold">Premium</span>
          <span className="font-serif text-xl font-bold text-accent">
            {isYearly ? "$39.99/yr" : "$4.99/mo"}
          </span>
        </div>
        {[
          "Unlimited decks",
          "AI flashcards from text or PDF",
          "Advanced stats & CSV export",
          "No ads",
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2.5 text-[13.5px]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </div>
        ))}
      </div>
    </>
  );
}
