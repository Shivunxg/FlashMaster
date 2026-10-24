"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifyPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) redirect("/admin/login?error=invalid");

  const valid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!valid) redirect("/admin/login?error=invalid");

  let isAdmin = user.isAdmin;

  // Bootstrap: the account matching SUPERADMIN_EMAIL is promoted to admin on
  // its first successful admin-login attempt. Requires knowing that
  // account's real password — the env var alone grants nothing.
  const superadminEmail = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  if (!isAdmin && superadminEmail && email === superadminEmail) {
    await db.user.update({ where: { id: user.id }, data: { isAdmin: true } });
    isAdmin = true;
  }

  if (!isAdmin) redirect("/admin/login?error=unauthorized");

  await createSession(user.id);
  redirect("/admin");
}

export async function adminLogoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function toggleUserPremiumAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) redirect("/admin");

  await db.user.update({ where: { id: userId }, data: { isPremium: !target.isPremium } });
  revalidatePath("/admin");
}

export async function toggleUserAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");

  if (userId === admin.id) redirect("/admin"); // don't let an admin strip their own access by accident

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) redirect("/admin");

  await db.user.update({ where: { id: userId }, data: { isAdmin: !target.isAdmin } });
  revalidatePath("/admin");
}
