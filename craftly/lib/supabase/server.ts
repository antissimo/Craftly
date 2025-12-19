import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";

export const supabaseServer = async () => {
  const cookieStore = await nextCookies();

  const cookieAdapter = {
    getAll() {
      return cookieStore.getAll().map((c) => ({
        name: c.name,
        value: c.value,
        options: { path: "/", httpOnly: true },
      }));
    },
    setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
      cookiesToSet.forEach(({ name, value, options }) => {
        cookieStore.set(name, value, options);
      });
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );
};