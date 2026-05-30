"use server";

import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return { success: false, error: "Admin credentials not configured on server." };
  }

  if (email === adminEmail && password === adminPassword) {
    // Set HTTP-only secure cookie
    cookies().set("admin_auth_token", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    
    return { success: true };
  }

  return { success: false, error: "Invalid email or password." };
}

export async function logoutAdmin() {
  cookies().delete("admin_auth_token");
}
