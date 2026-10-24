import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { devUnlockPremiumAction } from "@/app/actions/premium";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="font-serif text-xl font-semibold">Checkout isn&apos;t wired up yet</span>
      <p className="max-w-xs text-sm text-ink-soft">
        {stripeConfigured
          ? "Stripe keys are set, but the checkout session handler hasn't been built yet."
          : "Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to your environment, then build a Stripe Checkout session here."}
      </p>

      <form action={devUnlockPremiumAction}>
        <button
          type="submit"
          className="rounded-full border-[1.5px] border-dashed border-border px-5 py-3 text-sm font-semibold text-ink-soft"
        >
          Simulate Premium unlock (dev only)
        </button>
      </form>

      <Link href="/premium" className="text-[13px] font-semibold text-primary">
        ← Back
      </Link>
    </div>
  );
}
