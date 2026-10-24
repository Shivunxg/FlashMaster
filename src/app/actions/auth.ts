"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";

export async function signupAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    redirect("/signup?error=invalid");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=exists");
  }

  const { hash, salt } = await hashPassword(password);
  const user = await db.user.create({
    data: { name, email, passwordHash: hash, passwordSalt: salt },
  });

  await createSession(user.id);
  redirect("/");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) redirect("/login?error=invalid");

  const valid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!valid) redirect("/login?error=invalid");

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
