import {supabase} from "./supabaseClient.js";

export async function handleLogin(email, password) {
    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) throw error;
    return data;
}

export async function handleLogout() {
    await supabase.auth.signOut();
}
