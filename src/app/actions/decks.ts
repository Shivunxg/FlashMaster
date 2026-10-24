"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const FREE_DECK_LIMIT = 3;

export async function createDeckAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const color = String(formData.get("color") ?? "primary");

  if (!name) redirect("/decks/new?error=missing-name");

  if (!user.isPremium) {
    const deckCount = await db.deck.count({ where: { userId: user.id } });
    if (deckCount >= FREE_DECK_LIMIT) {
      redirect("/premium?reason=deck-limit");
    }
  }

  const deck = await db.deck.create({
    data: { userId: user.id, name, subject, color },
  });

  revalidatePath("/");
  redirect(`/decks/${deck.id}/cards/new`);
}

export async function createCardAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const deckId = String(formData.get("deckId") ?? "");
  const front = String(formData.get("front") ?? "").trim();
  const back = String(formData.get("back") ?? "").trim();
  const example = String(formData.get("example") ?? "").trim();
  const action = String(formData.get("intent") ?? "another");

  const deck = await db.deck.findFirst({ where: { id: deckId, userId: user.id } });
  if (!deck) redirect("/");

  if (front && back) {
    await db.card.create({
      data: { deckId, front, back, example: example || null },
    });
  }

  revalidatePath("/");

  if (action === "done") {
    redirect("/");
  }
  redirect(`/decks/${deckId}/cards/new`);
}
