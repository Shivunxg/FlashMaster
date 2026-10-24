"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { schedule, type Grade } from "@/lib/sm2";
import { nextStreak } from "@/lib/streak";

export async function reviewCardAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const cardId = String(formData.get("cardId") ?? "");
  const deckId = String(formData.get("deckId") ?? "");
  const grade = String(formData.get("grade") ?? "good") as Grade;
  const total = String(formData.get("total") ?? "");

  const card = await db.card.findUnique({ where: { id: cardId } });
  if (!card) redirect(`/study/${deckId}`);

  const result = schedule(card, grade);

  await db.$transaction([
    db.card.update({
      where: { id: cardId },
      data: {
        easeFactor: result.easeFactor,
        intervalDays: result.intervalDays,
        repetitions: result.repetitions,
        dueAt: result.dueAt,
        lastReviewedAt: new Date(),
      },
    }),
    db.reviewLog.create({ data: { cardId, grade } }),
  ]);

  const streak = nextStreak(user.lastStudyAt, user.streak);
  await db.user.update({
    where: { id: user.id },
    data: { streak, lastStudyAt: new Date() },
  });

  revalidatePath("/");
  redirect(`/study/${deckId}${total ? `?total=${total}` : ""}`);
}
