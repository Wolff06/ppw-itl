import {supabase} from "./supabaseClient.js";

export async function handleLogin(id, password) {

    // step 1 - get ID
    const { data: user, error: userError } = await supabase
        .from('usuario')
        .select('id')
        .eq('id_usuario', id)
        .single();

    if (userError) throw userError;
    const uid = user.id;

    // step 2 - get Mail
    const { data: emailData, error: emailError } = await supabase.rpc(
        'get_email_by_user_id',
        { uid }
    );

    if (emailError) throw emailError;
    const email = emailData; // depends on what your RPC returns

    // step 3 - Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) throw authError;
    return authData;
}

export async function handleLogout() {
    await supabase.auth.signOut();
}
