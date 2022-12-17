import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { gameController } from "../../application/game/game_controller";
import field from "../../assets/field.jpg";
import Button from "../../components/button";
import AppDialog from "../../components/dialog";
import PageWrapper from "../../components/page-wrapper";
import PlayerCell from "../../components/player-cell";
import Stats from "../../components/stats";
import { Game, Player } from "../../domain/game/game";
import AppListBox from "./components/list-box";

export type Input = {
  name: string;
  role: { value: string; name: string };
};

export default function GamePage() {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [squadModalIsOpen, setIsSquadOpen] = React.useState(false);
  const { id } = router.query;
  const { game, isLoading, isError, refetch } = useGetGame(id as string);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control,
  } = useForm<Input>();
  const matches = useMediaQuery("(min-width: 768px)");

  const onSubmit: SubmitHandler<Input> = async (data) => {
    // Check if user from data with the same name is already in the game
    const isUserInGame = game?.participants.some(
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
    };
    await gameController.updateGame(game.id, player);
    closeModal();
    reset();
    refetch();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openSquadModal = () => {
    setIsSquadOpen(true);
  };

  const closeSquadModal = () => {
    setIsSquadOpen(false);
  };

  const hanldePlayerDelete = async (player: Player) => {
    if (!game?.id) return;
    await gameController.deletePlayer(game.id, player);
    refetch();
  };

  const splitPlayers = useMemo(() => {
    // First game.numberOfPlayers players
    const mainSquad =
      game?.participants.slice(0, game.numberOfPlayers ?? 14) ?? [];

    // Players on the bench
    const bench = game?.participants.slice(game.numberOfPlayers ?? 14) ?? [];

    return { mainSquad, bench };
  }, [game?.numberOfPlayers, game?.participants]);

  const assignPlayerToMostRareRole = (
    defenders: Player[],
    midfielders: Player[],
    forwards: Player[]
  ) => {
    const defendersCount = defenders.length;
    const midfieldersCount = midfielders.length;
    const forwardsCount = forwards.length;

    if (defendersCount <= midfieldersCount && defendersCount <= forwardsCount) {
      return "DF";
    }

    if (
      midfieldersCount <= defendersCount &&
      midfieldersCount <= forwardsCount
    ) {
      return "MF";
    }

    if (forwardsCount <= defendersCount && forwardsCount <= midfieldersCount) {
      return "FW";
    }

    return "DF";
  };

  const suggestedSquds = useMemo(() => {
    const { mainSquad } = splitPlayers;

    // Get all players with the same role
    const goalkeepers = mainSquad.filter((player) => player.role === "GK");
    const defenders = mainSquad.filter((player) => player.role === "DF");
    const midfielders = mainSquad.filter((player) => player.role === "MF");
    const forwards = mainSquad.filter((player) => player.role === "FW");

    const squad1 = [];
    const squad2 = [];

    // For every GK add one to squad1 and one to squad2.
    for (let i = 0; i < goalkeepers.length; i++) {
      if (squad1.length === 7) {
        squad2.push(goalkeepers[i]);
      } else if (squad2.length === 7) {
        squad1.push(goalkeepers[i]);
      } else if (i % 2 === 0) {
        squad1.push(goalkeepers[i]);
      } else {
        squad2.push(goalkeepers[i]);
      }
    }

    // For every DF add one to squad1 and one to squad2. If one squad has 7 players, add to the other one
    for (let i = 0; i < defenders.length; i++) {
      if (squad1.length === 7) {
        squad2.push(defenders[i]);
      } else if (squad2.length === 7) {
        squad1.push(defenders[i]);
      } else if (i % 2 === 0) {
        squad1.push(defenders[i]);
      } else {
        squad2.push(defenders[i]);
      }
    }

    // For every MF add one to squad1 and one to squad2
    for (let i = 0; i < midfielders.length; i++) {
      if (squad1.length === 7) {
        squad2.push(midfielders[i]);
      } else if (squad2.length === 7) {
        squad1.push(midfielders[i]);
      } else if (i % 2 === 0) {
        squad1.push(midfielders[i]);
      } else {
        squad2.push(midfielders[i]);
      }
    }

    // For every FW add one to squad1 and one to squad2
    for (let i = 0; i < forwards.length; i++) {
      if (squad1.length === 7) {
        squad2.push(forwards[i]);
      } else if (squad2.length === 7) {
        squad1.push(forwards[i]);
      } else if (i % 2 === 0) {
        squad1.push(forwards[i]);
      } else {
        squad2.push(forwards[i]);
      }
    }

    return [squad1, squad2];
  }, [splitPlayers]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !game) {
    return <div>Error</div>;
  }

  return (
    <PageWrapper>
      <Stats
        playrsLength={game.participants.length}
        name={game.name}
        description={game.description}
        price={game.price}
        place={game.place}
        date={game.date}
        numberOfPlayers={game.numberOfPlayers ?? 14}
      />
      <div className="flex space-x-4">
        <AppDialog
          isOpen={modalIsOpen}
          openModal={openModal}
          closeModal={closeModal}
          title="Zapisz się"
          buttonLabel="Zapisz się"
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
          isOpen={squadModalIsOpen}
          openModal={openSquadModal}
          closeModal={closeSquadModal}
          title=" Zobacz propozycję składów"
          buttonLabel=" Zobacz propozycję składów"
          full
        >
          {!matches && (
            <div className="flex flex-col w-full h-full">
              {suggestedSquds[0].map((player, index) => (
                <div className="w-full" key={player.id}>
                  <PlayerCell index={index + 1} player={player} />
                </div>
              ))}
              <p className="py-4">Skład 2:</p>
              {suggestedSquds[1].map((player, index) => (
                <div className="w-full" key={player.id}>
                  <PlayerCell bench index={index + 1} player={player} />
                </div>
              ))}
            </div>
          )}
          {matches && (
            <div
              onClick={closeSquadModal}
              className=" flex flex-col w-full h-full justify-center items-center"
            >
              <div
                className={` w-full h-full lg:h-1/2 lg:w-1/2 flex flex-col justify-center items-center relative bg-cover bg-center`}
              >
                <Image src={field} alt="boisko" />
                <div
                  className=" absolute w-10 gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, left: "10%" }}
                >
                  {
                    // All GKs from first suggested squad
                    suggestedSquds[0]
                      .filter((player) => player.role === "GK")
                      .map((player, index) => (
                        <div
                          className="flex flex-col justify-center items-center"
                          key={player.id}
                        >
                          <div className="  bg-pink-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                          <p
                            className="text-white text-center"
                            style={{ fontSize: 11 }}
                          >
                            {player.name}
                          </p>
                        </div>
                      ))
                  }
                </div>
                <div
                  className=" absolute w-10  gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, left: "22%" }}
                >
                  {suggestedSquds[0]
                    .filter((player) => player.role === "DF")
                    .map((player, index) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={player.id}
                      >
                        <div className="  bg-pink-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                        <p
                          className="text-white text-center"
                          style={{ fontSize: 11 }}
                        >
                          {player.name}
                        </p>
                      </div>
                    ))}
                </div>
                <div
                  className=" absolute w-10 gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, left: "32%" }}
                >
                  {suggestedSquds[0]
                    .filter((player) => player.role === "MF")
                    .map((player, index) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={player.id}
                      >
                        <div className=" bg-pink-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                        <p
                          className="text-white text-center"
                          style={{ fontSize: 11 }}
                        >
                          {player.name}
                        </p>
                      </div>
                    ))}
                </div>
                <div
                  className=" absolute w-10 gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, left: "42%" }}
                >
                  {suggestedSquds[0]
                    .filter((player) => player.role === "FW")
                    .map((player, index) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={player.id}
                      >
                        <div className="  bg-pink-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                        <p
                          className="text-white text-center"
                          style={{ fontSize: 11 }}
                        >
                          {player.name}
                        </p>
                      </div>
                    ))}
                </div>
                <div
                  className=" absolute w-10 gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, right: "10%" }}
                >
                  {
                    // All GKs from first suggested squad
                    suggestedSquds[1]
                      .filter((player) => player.role === "GK")
                      .map((player, index) => (
                        <div
                          className="flex flex-col justify-center items-center"
                          key={player.id}
                        >
                          <div className="  bg-blue-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                          <p
                            className="text-white text-center"
                            style={{ fontSize: 11 }}
                          >
                            {player.name}
                          </p>
                        </div>
                      ))
                  }
                </div>
                <div
                  className=" absolute w-10  gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, right: "22%" }}
                >
                  {suggestedSquds[1]
                    .filter((player) => player.role === "DF")
                    .map((player, index) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={player.id}
                      >
                        <div className="  bg-blue-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                        <p
                          className="text-white text-center"
                          style={{ fontSize: 11 }}
                        >
                          {player.name}
                        </p>
                      </div>
                    ))}
                </div>
                <div
                  className=" absolute w-10 gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, right: "32%" }}
                >
                  {suggestedSquds[1]
                    .filter((player) => player.role === "MF")
                    .map((player, index) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={player.id}
                      >
                        <div className=" bg-blue-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                        <p
                          className="text-white text-center"
                          style={{ fontSize: 11 }}
                        >
                          {player.name}
                        </p>
                      </div>
                    ))}
                </div>
                <div
                  className=" absolute w-10 gap-y-14 flex flex-col justify-center items-center"
                  style={{ top: 0, bottom: 0, right: "42%" }}
                >
                  {suggestedSquds[1]
                    .filter((player) => player.role === "FW")
                    .map((player, index) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={player.id}
                      >
                        <div className="  bg-blue-400 rounded-full w-4 h-4 md:w-6 md:h-6" />
                        <p
                          className="text-white text-center"
                          style={{ fontSize: 11 }}
                        >
                          {player.name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          <Button color="gray" type="button" onClick={closeSquadModal}>
            Zamknij
          </Button>
        </AppDialog>
      </div>
      <div className="w-full px-4">
        <div className="grid grid-cols-12 gap-4 pb-4">
          <div className="col-span-12 sm:col-span-9 md:col-span-9">
            <p className="font-bold pb-4">Grają:</p>
            {splitPlayers.mainSquad.map((participant, index) => (
              <div className="w-full" key={participant.id}>
                <PlayerCell
                  onClick={() => hanldePlayerDelete(participant)}
                  index={index + 1}
                  player={participant}
                />
              </div>
            ))}
          </div>
          <div className="col-span-12 sm:col-span-3 md:col-span-3">
            <p className="font-bold pb-4">Rezerwa:</p>
            {splitPlayers.bench.map((participant, index) => (
              <div className="w-full" key={participant.id}>
                <PlayerCell bench index={index + 1} player={participant} />
              </div>
            ))}
          </div>
          {/* <div className="col-span-12 sm:col-span-4 md:col-span-4">
            <p className="font-bold pb-4">Zrezygnowali:</p>
            {(game.removedPlayers ?? []).map((participant, index) => (
              <div className="w-full" key={participant.id}>
                <PlayerCell bench index={index + 1} player={participant} />
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </PageWrapper>
  );
}

const useGetGame = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery<Game, Error>({
    queryKey: ["game", id],
    queryFn: () => gameController.getGame(id).then((res) => res),
  });

  return { game: data, isLoading, isError, refetch };
};

function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}
