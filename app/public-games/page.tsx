import CityPicker from "../../components/city-picker";
import PublicGameCell from "../../components/public-game-cell";
import { Game } from "../../domain/game/game";
import { createClient } from "../../utils/supabase-server";

export const revalidate = 0;

interface Props {
  searchParams?: {
    search?: string;
  };
}

export default async function Page(props: Props) {
  const { searchParams } = props;
  const { search } = searchParams || {};
  const supabase = createClient();

  const today = new Date();
  const todayTimestamp = today.toISOString().split("T")[0];

  const { data: cityGames } = await supabase
    .from("games")
    .select("*, players(*)")
    .order("date", {
      ascending: true,
    })
    .gte("date", todayTimestamp)
    .eq("isPublic", true)
    .textSearch("city", `%${search}%`, {
      type: "websearch",
    });

  const { data: allGames } = await supabase
    .from("games")
    .select("*, players(*)")
    .order("date", {
      ascending: true,
    })
    .gte("date", todayTimestamp)
    .eq("isPublic", true);

  const games = search !== undefined && search !== "" ? cityGames : allGames;

  return (
    <section className="text-gray-600 body-font bojo min-h-screen ">
      <div className="container px-5 pt-24 mx-auto">
        <div className="flex flex-wrap w-full mb-5 flex-col items-center text-center">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            Mecze piłkarskie w Twoim mieście
          </h1>
          <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
            Znajdź i dołącz do meczu piłkarskiego w Twoim mieście.
          </p>
        </div>
        <div className="pb-6">
          <CityPicker search={search} />
        </div>
        <div className="">
          {games && games.length > 0 && (
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
      </div>
    </section>
  );
}
