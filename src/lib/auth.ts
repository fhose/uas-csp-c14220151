import { supabase } from "./supabase"

// Login dengan username dan password
export async function loginWithUsername(username: string, password: string) {
    console.log("Login attempt for username:", username); // Tambahkan ini
  // 1. Ambil email user dari tabel `users`
  const { data: userRecord, error } = await supabase
    .from("users")
    .select("email")
    .eq("username", username)
    .single();

  if (error || !userRecord) {
    console.error("Error or no user record found in public.users:", error); // Tambahkan ini
    console.log("userRecord from public.users:", userRecord); // Tambahkan ini
    return { error: "Username tidak ditemukan." };
  }
  console.log("User record found in public.users:", userRecord); // Tambahkan ini

  // 2. Login pakai Supabase Auth
  const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
    email: userRecord.email,
    password,
  });

  if (loginError || !authData.user) {
    return { error: "Password salah atau akun tidak valid." };
  }

  // 3. Ambil data lengkap dari tabel `users` berdasarkan email
  const { data: fullUser, error: userTableError } = await supabase
    .from("users")
    .select("*")
    .eq("email", userRecord.email)
    .single();

  if (userTableError || !fullUser) {
    return { error: "Gagal mengambil data user dari database." };
  }

  return { data: fullUser };
}


// ✅ auth.ts
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

