import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PremiumPlanToggle } from "./premium-plan-toggle";

export default async function PremiumPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-3.5">
        <span className="w-4.5" />
        <span className="font-serif text-[17px] font-semibold">FlashMaster Premium</span>
        <Link href="/" aria-label="Close" className="text-ink-soft">
          ×
        </Link>
      </header>

      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        <div className="flex flex-col gap-1.5 text-center">
          <span className="font-serif text-[22px] font-semibold">Study without limits</span>
          <span className="text-[13px] text-ink-soft">
            Unlimited decks, AI-generated cards, and deeper stats.
          </span>
        </div>

        <PremiumPlanToggle />

        <div className="flex flex-col gap-2 rounded-3xl border border-border p-5 opacity-70">
          <span className="text-sm font-semibold">Free</span>
          <div className="flex items-center gap-2.5 text-[13.5px] text-ink-soft">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
            3 decks max
          </div>
          <div className="flex items-center gap-2.5 text-[13.5px] text-ink-soft">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
            Manual cards only
          </div>
        </div>
      </main>

      <div className="flex flex-col gap-2 px-5 pb-6">
        <Link
          href="/premium/checkout"
          className="rounded-full bg-primary py-3.5 text-center text-sm font-bold text-white transition active:scale-[.98]"
        >
          Continue to Secure Checkout
        </Link>
        <span className="text-center text-[11px] text-ink-soft">7-day free trial · cancel anytime</span>
      </div>
    </div>
  );
}
