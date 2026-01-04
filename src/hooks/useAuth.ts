import supabase from "../client/supabase";

export function useAuth() {
    const signOut = () => supabase.auth.signOut();

    return { signOut };
}
