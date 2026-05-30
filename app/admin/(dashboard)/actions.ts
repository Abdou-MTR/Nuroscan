"use server";

import { createClient } from "@supabase/supabase-js";

export async function fetchAllUsers() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*");

  if (error) {
    console.error("Error fetching users with service role:", error);
    return [];
  }

  // Sort by created_at descending if it exists, otherwise by id
  return data?.sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return b.id.localeCompare(a.id);
  }) || [];
}

export async function deleteUser(userId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Delete from public profiles table
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);
  
  if (profileError) {
    return { success: false, error: profileError.message };
  }
  
  // Also delete from Auth so the user can't log in anymore
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    return { success: false, error: authError.message };
  }

  return { success: true };
}
