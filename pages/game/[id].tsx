import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import { gameController } from "../../application/game/game_controller";
import Button from "../../components/button";
import PageWrapper from "../../components/page-wrapper";
import PlayerCell from "../../components/player-cell";
import Stats from "../../components/stats";
import { Game, Player } from "../../domain/game/game";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "20%",
    bottom: "20%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

type Input = {
  name: string;
  role: string;
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
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = async (data) => {
    // Check if user from data with the same name is already in the game
    const isUserInGame = game?.participants.some(
      (participant) => participant.name === data.name
    );

    if (isUserInGame) {
      alert("Jesteś już w grze albo ktoś podpisał sie tak samo jak ty");
      return;
    }

    if (!game?.id) return;
    const player = {
      id: uuidv4(),
      name: data.name,
      role: data.role,
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
    // First 14 players
    const mainSquad = game?.participants.slice(0, 14) ?? [];

    // Players on the bench
    const bench = game?.participants.slice(14) ?? [];

    return { mainSquad, bench };
  }, [game?.participants]);

  const suggestedSquds = useMemo(() => {
    const { mainSquad } = splitPlayers;

    // Get all players with the same role
    const goalkeepers = mainSquad.filter((player) => player.role === "GK");
    const defenders = mainSquad.filter((player) => player.role === "DF");
    const midfielders = mainSquad.filter((player) => player.role === "MF");
    const forwards = mainSquad.filter((player) => player.role === "FW");
    const nonCategorised = mainSquad.filter((player) => player.role === "None");

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

    // For every None add one to squad1 and one to squad2
    for (let i = 0; i < nonCategorised.length; i++) {
      if (squad1.length === 7) {
        squad2.push(nonCategorised[i]);
      } else if (squad2.length === 7) {
        squad1.push(nonCategorised[i]);
      } else if (i % 2 === 0) {
        squad1.push(nonCategorised[i]);
      } else {
        squad2.push(nonCategorised[i]);
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
      />
      <div className="flex space-x-4">
        <Button onClick={openModal} type="button">
          Zapisz się
        </Button>
        <Button onClick={openSquadModal} type="button">
          Zobacz propozycję składów
        </Button>
      </div>
      <div className="w-full px-4">
        <div className="grid grid-cols-12 gap-4 pb-4">
          <div className="col-span-12 sm:col-span-9 md:col-span-9">
            <p className="font-bold pb-4    ">Grają:</p>
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
            <p className="font-bold pb-4    ">Rezerwa:</p>
            {splitPlayers.bench.map((participant, index) => (
              <div className="w-full" key={participant.id}>
                <PlayerCell bench index={index + 1} player={participant} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Zapisz się"
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
                className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                type="text"
                {...register("name", { required: true })}
                placeholder="Imię"
              />
              <label className="block mb-2 text-sm font-medium text-gray-900    ">
                Jezeli jest wybór to gdzie wolisz grać ?
              </label>
              <select
                id="countries"
                {...register("role", { required: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
              >
                <option selected value="None">
                  Wyjebane
                </option>
                <option value="GK">Gruby na brame</option>
                <option value="DF">Obrona</option>
                <option value="MF">Pomoc</option>
                <option value="FW">Napad</option>
              </select>
              <div className="py-2 flex justify-between w-full">
                <Button disabled={isSubmitting}>Zapisz się</Button>
                <Button type="button" onClick={closeModal}>
                  Zamknij
                </Button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isOpen={squadModalIsOpen}
          onRequestClose={closeSquadModal}
          contentLabel="Zapisz się"
        >
          <div className="flex flex-col w-full h-full">
            <Button type="button" onClick={closeSquadModal}>
              Zamknij
            </Button>
            <div className="w-full flex flex-col justify-between h-full items-start">
              <div className="w-full flex flex-col justify-between h-full items-start">
                <p className="font-bold pb-4">Skład 1:</p>
                {suggestedSquds[0].map((participant, index) => (
                  <div className="w-full" key={participant.id}>
                    <PlayerCell index={index + 1} player={participant} />
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-col justify-between h-full items-start">
                <p className="font-bold pb-4">Skład 2:</p>
                {suggestedSquds[1].map((participant, index) => (
                  <div className="w-full" key={participant.id}>
                    <PlayerCell bench index={index + 1} player={participant} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
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
