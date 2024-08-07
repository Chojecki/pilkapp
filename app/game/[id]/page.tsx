import "server-only";

// do not cache this page
export const revalidate = 0;

import FootballField from "../../../components/field";
import GamePlayersList from "../../../components/game-players-list";
import GameStatsPanel from "../../../components/game-stats-panel";
import { Game, Player } from "../../../domain/game/game";
import { splitPlayers, suggestSquads } from "../../../utils/squads";
import { createClient } from "../../../utils/supabase-server";

interface Props {
  params: {
    id: string;
  };
}

export default async function GamePage({ params }: Props) {
  const id = params.id;
  const supabase = createClient();

  const { data: game, error } = await supabase
    .from("games")
    .select("*, players(*)")
    .order("created_at", {
      foreignTable: "players",
      ascending: true,
    })
    .eq("id", id)
    .single();

  const { data: userData } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", (await supabase.auth.getSession()).data?.session?.user.id)
    .single();

  const players = game?.players ?? [];

  const playersWhoPlays = (players as Player[]).slice(
    0,
    game?.numberOfPlayers ?? 2
  );

  const teamA = playersWhoPlays.filter((player) => player.team === 1);
  const teamB = playersWhoPlays.filter((player) => player.team === 2);

  const customTeams = game?.customTeams ? [teamA, teamB] : undefined;

  const inputAIPlayers: Player[] = playersWhoPlays.map((player) => ({
    name: player.name,
    id: player.id,
    skill: (player.skill as "1" | "2" | "3" | "4" | "5") ?? "3",
    shape: (player.shape as "1" | "2" | "3" | "4" | "5") ?? "3",
    role: player.role as "GK" | "DF" | "MF" | "FW",
    gameId: game?.id ?? "",
  }));

  const splitedPlayers = splitPlayers(players as Player[], game as Game);

  const suggestedSquds = customTeams
    ? customTeams
    : suggestSquads(splitedPlayers.mainSquad, game as Game);

  if (!game || !players || error) return <div>Błąd meczu :/</div>;

  return (
    <div className="h-screen md:fixed w-full">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <GameStatsPanel
          suggestedSquds={suggestedSquds}
          game={game as Game}
          players={players as Player[]}
          userData={userData}
          inputAIPlayers={inputAIPlayers}
        />

        <div className="col-span-2 md:overflow-y-scroll md:h-screen">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="w-full flex items-center justify-center bojo relative">
              <div className="absolute top-0 bottom-0 left-0 right-0" />
              <div className=" m-4 hidden md:block shadow-2 xl">
                <FootballField squds={suggestedSquds} />
              </div>
            </div>
            <GamePlayersList
              splitedPlayers={splitedPlayers}
              gameCreator={game.creator}
              creatorEmail={game.creatorEmail ?? undefined}
              canAnonRemove={game.canAnonRemove ?? false}
              gameName={game.name ?? "Brak nazwy"}
              ignoreLocalStorage={game.ignoreLocalStorage ?? false}
              isGamePublic={game.isPublic ?? false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
