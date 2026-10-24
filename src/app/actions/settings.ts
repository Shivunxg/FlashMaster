"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser, destroySession } from "@/lib/auth";

export async function toggleNotifyAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await db.user.update({ where: { id: user.id }, data: { notifyEnabled: !user.notifyEnabled } });
  revalidatePath("/settings");
}

export async function toggleSoundAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await db.user.update({ where: { id: user.id }, data: { soundEnabled: !user.soundEnabled } });
  revalidatePath("/settings");
}

export async function logoutFromSettingsAction() {
  await destroySession();
  redirect("/login");
}
