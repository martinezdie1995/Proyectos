export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url && !publishableKey) {
    return null;
  }

  if (!url || !publishableKey) {
    throw new Error(
      "Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
}
