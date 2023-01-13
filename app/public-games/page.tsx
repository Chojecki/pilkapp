import PublicGameCell from "../../components/public-game-cell";
import { Game } from "../../domain/game/game";
import { createClient } from "../../utils/supabase-server";

export const revalidate = 0;

export default async function Page() {
  const supabase = createClient();

  const { data: games, error } = await supabase
    .from("games")
    .select("*, players(*)")
    .order("created_at", {
      ascending: true,
    })
    .eq("isPublic", true);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            Mecze piłkarskie w Twoim mieście
          </h1>
          <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
            Znajdź i dołącz do meczu piłkarskiego w Twoim mieście.
          </p>
        </div>
        {games?.length && (
          <div className="flex flex-wrap -m-4">
            {games.map((item, index) => (
              <div
                key={item.id ?? index}
                className="xl:w-1/3 md:w-1/2 w-full p-4"
              >
                <PublicGameCell game={item as Game} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
