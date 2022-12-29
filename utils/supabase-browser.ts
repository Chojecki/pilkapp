import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../domain/supabase";

export const createBrowserClient = () =>
  createBrowserSupabaseClient<Database>();
