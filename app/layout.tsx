import "server-only";

import { Montserrat } from "@next/font/google";

import { createClient } from "../utils/supabase-server";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";

import SupabaseListener from "../components/supabase-listener";
import SupabaseProvider from "../components/supabase-provider";
import { Database } from "../domain/supabase";
import "../styles/globals.css";

export type TypedSupabaseClient = SupabaseClient<Database>;

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <SupabaseProvider session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
