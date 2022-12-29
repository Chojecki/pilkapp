import Link from "next/link";
import "server-only";

import { createClient } from "../../utils/supabase-server";

// do not cache this page
export const revalidate = 0;

// the user will be redirected to the landing page if they are not signed in
// check middleware.tsx to see how this routing rule is set
export default async function Page() {
  const supabase = createClient();

  const { data } = await supabase.from("games").select("*");

  return (
    <div>
      {data?.map((game) => (
        <div key={game.id}>
          <Link href={`/game/${game.id}`}>{game.name}</Link>
        </div>
      ))}
    </div>
  );
}
