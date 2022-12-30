import dayjs from "dayjs";
import Link from "next/link";
import "server-only";
import ItemCard from "../../components/item-card";

import { createClient } from "../../utils/supabase-server";

// do not cache this page
export const revalidate = 0;

// the user will be redirected to the landing page if they are not signed in
// check middleware.tsx to see how this routing rule is set
export default async function Page() {
  const supabase = createClient();

  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("creator", (await supabase.auth.getSession()).data?.session?.user.id)
    .order("date", { ascending: false });

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-sky-900 to-sky-600  py-4">
        Twoje gry:
      </h2>
      {data?.map((game) => (
        <div key={game.id}>
          <Link href={`/game/${game.id}`}>
            <ItemCard
              title={dayjs(game.date ?? "").format("DD.MM.YYYY")}
              boldTitle={game.name ?? "Bład wczytywania nazwy"}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
