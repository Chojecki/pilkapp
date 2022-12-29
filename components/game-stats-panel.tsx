"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Game, Player } from "../domain/game/game";
import { assignPlayerToMostRareRole, suggestSquads } from "../utils/squads";
import { createBrowserClient } from "../utils/supabase-browser";
import Button from "./button";
import AppDialog from "./dialog";
import AppListBox from "./list-box";
import PlayerCell from "./player-cell";
import Stats from "./stats";

export type Input = {
  name: string;
  role: { value: string; name: string };
};

export default function GameStatsPanel({
  game,
  players,
}: {
  game: Game;
  players: Player[];
}) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [squadModalIsOpen, setSquadIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<Input>();

  const splitPlayers = useMemo(() => {
    // First game.numberOfPlayers players
    const mainSquad = players?.slice(0, game?.numberOfPlayers ?? 14) ?? [];

    // Players on the bench
    const bench = players?.slice(game?.numberOfPlayers ?? 14) ?? [];

    return { mainSquad, bench };
  }, [game?.numberOfPlayers, players]);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    // Check if user from data with the same name is already in the game
    const isUserInGame = players?.some(
      (participant) => participant.name === data.name
    );

    if (isUserInGame) {
      alert("Jesteś już w grze albo ktoś podpisał sie tak samo jak ty");
      return;
    }

    let role = data.role.value;

    if (data.role.value === "None") {
      const { mainSquad } = splitPlayers;

      const defenders = mainSquad.filter((player) => player.role === "DF");
      const midfielders = mainSquad.filter((player) => player.role === "MF");
      const forwards = mainSquad.filter((player) => player.role === "FW");

      const mostRare = assignPlayerToMostRareRole(
        defenders,
        midfielders,
        forwards
      );
      if (mostRare === "DF") {
        role = "DF";
      } else if (mostRare === "MF") {
        role = "MF";
      } else if (mostRare === "FW") {
        role = "FW";
      }
    }

    if (!game?.id) return;
    const player = {
      id: uuidv4(),
      name: data.name,
      role,
      gameId: game.id,
    };
    await supabase.from("players").insert([player]);
    router.refresh();
    closeModal();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openSquadModal = () => {
    setSquadIsOpen(true);
  };

  const closeSquadModal = () => {
    setSquadIsOpen(false);
  };

  const suggestedSquds = suggestSquads(splitPlayers.mainSquad, game);

  return (
    <div className="pb-8 md:overflow-y-scroll md:h-screen col-span-1 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 ...">
      <Stats
        playrsLength={players.length}
        name={game.name}
        description={game.description}
        price={game.price}
        place={game.place}
        date={game.date}
        time={game.time ?? "20:30"}
        creatorContact={game.creatorContact}
        numberOfPlayers={game.numberOfPlayers ?? 14}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:space-x-4">
          <AppDialog
            isOpen={modalIsOpen}
            closeOnTitle
            openModal={openModal}
            closeModal={closeModal}
            title="Zapisz się"
            buttonLabel="Zapisz się"
            full
            buttonPadding="px-4 py-3"
          >
            <div className="flex flex-col w-full h-full">
              <form
                className="w-full flex flex-col justify-between h-full items-start"
                onSubmit={handleSubmit(onSubmit)}
              >
                <label className="block mb-2 text-sm font-medium text-gray-900    ">
                  Imię
                </label>
                <input
                  className="bg-gray-50 mb-4 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Imię"
                />
                <label className="block bg-gray-50 mb-2 text-sm font-medium text-gray-900 border p-2 rounded-md  ">
                  Gdzie wolisz grać ? (wybież z listy) <br />
                  <span className="font-small text-xs text-gray-600">
                    Jeżeli jest ci to obojętne, dostaniesz losową pozycje której
                    jest akurat najmniej, tak aby było łatwo podzielić skład
                  </span>
                </label>
                <AppListBox
                  padding="py-2"
                  control={control}
                  items={[
                    { value: "None", name: "Wyjebane" },
                    { value: "GK", name: "Gruby na brame" },
                    { value: "DF", name: "Obrona" },
                    { value: "MF", name: "Pomoc" },
                    { value: "FW", name: "Napad" },
                  ]}
                />
                <div className="py-2 flex justify-between w-full">
                  <Button color="gray" type="button" onClick={closeModal}>
                    Zamknij
                  </Button>
                  <Button disabled={isSubmitting}>Zapisz się</Button>
                </div>
              </form>
            </div>
          </AppDialog>
          <AppDialog
            closeOnTitle
            buttonColor="green"
            isOpen={squadModalIsOpen}
            openModal={openSquadModal}
            closeModal={closeSquadModal}
            title="Sugerowane składy"
            buttonLabel="Poka składy"
            full
            buttonPadding="px-4 py-3"
          >
            <div className="">
              <p className="font-bold py-4">FC Ziomale</p>
              {suggestedSquds[0].map((player, index) => {
                return (
                  <div key={player.id}>
                    <PlayerCell dark player={player} index={index + 1} />
                  </div>
                );
              })}
            </div>
            <div className="pb-4">
              <p className="font-bold pt-6 pb-4">Mordeczki United</p>
              {suggestedSquds[1].map((player, index) => {
                return (
                  <div key={player.id}>
                    <PlayerCell
                      secondary
                      dark
                      player={player}
                      index={index + 1}
                    />
                  </div>
                );
              })}
            </div>
            <Button bold full onClick={closeSquadModal}>
              Ok
            </Button>
          </AppDialog>
        </div>
      </Stats>
    </div>
  );
}
