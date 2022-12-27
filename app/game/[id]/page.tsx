"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import Button from "../../../components/button";
import AppDialog from "../../../components/dialog";
import FootballField from "../../../components/field";
import AppListBox from "../../../components/list-box";
import PlayerCell from "../../../components/player-cell";
import Stats from "../../../components/stats";
import { useAuth } from "../../../context/auth-context";
import { Game, Player } from "../../../domain/game/game";
import { firebaseGameRepo } from "../../../infrastructure/game/game_repo";
import {
  assignPlayerToMostRareRole,
  suggestSquads,
} from "../../../utils/squads";

export type Input = {
  name: string;
  role: { value: string; name: string };
};

interface Props {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: Props) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [squadModalIsOpen, setSquadIsOpen] = React.useState(false);
  const id = params.id;
  const { user } = useAuth();
  const { game, isLoading, isError } = useGetGame(id as string);
  const { participants, isError: isParticipantsError } = useGetParticipants(
    id as string
  );
  const { mutate: addPlayer, isLoading: isAddLoading } = useUpdateGame();
  const { mutate: updatePlayer, isLoading: isPlayerUpdateLoading } =
    useUpdateParticipat();
  const { mutate: deletePlayer } = useDeleteParticipat();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control,
  } = useForm<Input>();

  const canManage = useMemo(() => {
    return user.uid === game?.creator;
  }, [user, game]);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    // Check if user from data with the same name is already in the game
    const isUserInGame = participants?.some(
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
    await addPlayer({ id: game.id, player });
    closeModal();
    reset();
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

  const hanldePlayerDelete = async (player: Player) => {
    if (!game?.id) return;
    await deletePlayer({ id: game.id, player });
  };

  const splitPlayers = useMemo(() => {
    // First game.numberOfPlayers players
    const mainSquad = participants?.slice(0, game?.numberOfPlayers ?? 14) ?? [];

    // Players on the bench
    const bench = participants?.slice(game?.numberOfPlayers ?? 14) ?? [];

    return { mainSquad, bench };
  }, [game?.numberOfPlayers, participants]);

  const suggestedSquds = suggestSquads(splitPlayers.mainSquad, game);

  if (isLoading || !participants) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h3>Ładowanie...</h3>
      </div>
    );
  }

  if (isError || !game || isParticipantsError) {
    return <div>Error</div>;
  }

  return (
    <div className="h-screen md:fixed w-full">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="pb-8 md:overflow-y-scroll md:h-screen col-span-1 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 ...">
          <Stats
            playrsLength={participants.length}
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
                        Jeżeli jest ci to obojętne, dostaniesz losową pozycje
                        której jest akurat najmniej, tak aby było łatwo
                        podzielić skład
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
        <div className="col-span-2 md:overflow-y-scroll md:h-screen">
          <div>
            <div className="flex flex-col w-full justify-center items-center">
              <div className="w-full flex items-center justify-center bojo relative">
                <div className="absolute top-0 bottom-0 left-0 right-0" />
                <div className=" m-4 hidden md:block shadow-2 xl">
                  <FootballField suggestedSquds={suggestedSquds} />
                </div>
              </div>
              {splitPlayers.mainSquad.length > 0 ? (
                <div className="p-4 w-full bg-gradient-to-r from-sky-900 via-sky-800 to-sky-800 ... ">
                  <h3 className="text-2xl font-extrabold text-white pb-4">
                    Grają:
                  </h3>
                  <div className="flex flex-col gap-3 w-full">
                    {splitPlayers.mainSquad.map((participant, index) => (
                      <div className="w-full" key={participant.id}>
                        <PlayerCell
                          onClick={() => hanldePlayerDelete(participant)}
                          index={index + 1}
                          canManage={canManage}
                          player={participant}
                          isLoading={isPlayerUpdateLoading}
                          onSwitchClick={(checked) => {
                            updatePlayer({
                              id: game.id,
                              player: { ...participant, didPay: checked },
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <h3 className="text-2xl  font-extrabold text-white py-4">
                    Rezerwa:
                  </h3>
                  {splitPlayers.bench.map((participant, index) => (
                    <div className="w-full" key={participant.id}>
                      <PlayerCell
                        bench
                        canManage={canManage}
                        index={index + 1}
                        player={participant}
                        onClick={() => hanldePlayerDelete(participant)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full p-4 w-full bg-gradient-to-r from-sky-900 via-sky-800 to-sky-800 ...">
                  <p className="text-white text-center text-2xl font-extrabold">
                    Dodaj pierwszego gracza, aby wyświetlić listę ...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const useGetGame = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery<Game, Error>({
    queryKey: ["game", id],
    queryFn: () => firebaseGameRepo.getGame(id).then((res) => res),
  });

  return { game: data, isLoading, isError, refetch };
};
const useGetParticipants = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery<Player[], Error>({
    queryKey: ["participants", id],
    queryFn: () => firebaseGameRepo.getParticipants(id).then((res) => res),
  });

  return { participants: data, isLoading, isError, refetch };
};

const useUpdateGame = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError } = useMutation<
    Player,
    Error,
    { id: string; player: Player }
  >((update) => firebaseGameRepo.updateGame(update.id, update.player), {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return { mutate, isLoading, isError };
};

const useUpdateParticipat = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError } = useMutation<
    Player,
    Error,
    { id: string; player: Player }
  >((update) => firebaseGameRepo.updatePlayer(update.id, update.player), {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return { mutate, isLoading, isError };
};

const useDeleteParticipat = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError } = useMutation<
    void,
    Error,
    { id: string; player: Player }
  >((update) => firebaseGameRepo.deletePlayer(update.id, update.player), {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return { mutate, isLoading, isError };
};
