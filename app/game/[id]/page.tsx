"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import Button from "../../../components/button";
import AppDialog from "../../../components/dialog";
import FootballField from "../../../components/field";
import PlayerCell from "../../../components/player-cell";
import Stats from "../../../components/stats";
import { Game, Player } from "../../../domain/game/game";
import { firebaseGameRepo } from "../../../infrastructure/game/game_repo";
import {
  assignPlayerToMostRareRole,
  suggestSquads,
} from "../../../utils/squads";
import AppListBox from "../components/list-box";

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
  const id = params.id;
  const { game, isLoading, isError, refetch } = useGetGame(id as string);
  const { participants, isLoading: areParticipantsLoading } =
    useGetParticipants(id as string);
  const { mutate, isLoading: isMutationLoading } = useUpdateParticipat();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control,
  } = useForm<Input>();

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
    await mutate({ id: game.id, player });
    closeModal();
    reset();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const hanldePlayerDelete = async (player: Player) => {
    if (!game?.id) return;
    await firebaseGameRepo.deletePlayer(game.id, player);
    refetch();
  };

  const splitPlayers = useMemo(() => {
    // First game.numberOfPlayers players
    const mainSquad = participants?.slice(0, game?.numberOfPlayers ?? 14) ?? [];

    // Players on the bench
    const bench = participants?.slice(game?.numberOfPlayers ?? 14) ?? [];

    return { mainSquad, bench };
  }, [game?.numberOfPlayers, participants]);

  const suggestedSquds = suggestSquads(splitPlayers.mainSquad, game);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !game || !participants) {
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
            numberOfPlayers={game.numberOfPlayers ?? 14}
          />
          <div className="flex px-5 justify-center space-x-4">
            <AppDialog
              isOpen={modalIsOpen}
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
                      której jest akurat najmniej, tak aby było łatwo podzielić
                      skład
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
          </div>
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
                          player={participant}
                          isLoading={isMutationLoading}
                          onSwitchClick={(checked) =>
                            mutate({
                              id: game.id,
                              player: { ...participant, didPay: checked },
                            })
                          }
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
                        index={index + 1}
                        player={participant}
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

const useUpdateParticipat = () => {
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
