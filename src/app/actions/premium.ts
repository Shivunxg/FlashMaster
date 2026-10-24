"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * Dev-only shortcut so premium-gated UI can be exercised before Stripe is
 * wired up. Never call this from a real checkout flow.
 */
export async function devUnlockPremiumAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await db.user.update({ where: { id: user.id }, data: { isPremium: true } });
  revalidatePath("/");
  redirect("/");
}
