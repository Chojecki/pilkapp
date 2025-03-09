"use client";

import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { Game, Player } from "../domain/game/game";
import { assignPlayerToMostRareRole, splitTeams } from "../utils/squads";
import { createBrowserClient } from "../utils/supabase-browser";
import Button from "./button";
import AppDialog from "./dialog";
import AppListBox from "./list-box";
import PlayerCell from "./player-cell";
import SquadComposerModal from "./squad-composer-modal";
import Stats from "./stats";
import { useSupabase } from "./supabase-provider";
import AppSwitch from "./switch";

interface SquadStore {
  aiSquads: Player[][];
  setAiSquads: (aiSquads: Player[][]) => void;
}

export const useSquadStore = create<SquadStore>((set) => ({
  aiSquads: [],
  setAiSquads: (aiSquads) => set({ aiSquads }),
}));

export type Input = {
  name: string;
  role: { value: string; name: string };
  shape: { value: string; name: string };
  skill: { value: string; name: string };
  isAnonymous: boolean;
};

export default function GameStatsPanel({
  game,
  players,
  userData,
  suggestedSquds,
  inputAIPlayers,
}: {
  game: Game;
  players: Player[];
  userData: {
    full_name: string | null;
  } | null;
  suggestedSquds: Player[][];
  inputAIPlayers: Player[];
}) {
  const router = useRouter();

  const supabase = createBrowserClient();
  const { session } = useSupabase();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalRemoveIsOpen, setRemoveIsOpen] = useState(false);
  const [squadModalIsOpen, setSquadIsOpen] = useState(false);

  const [aiSquadModalIsOpen, setAiSquadIsOpen] = useState(false);
  const [aiSquads, setAiSquads] = useSquadStore((state) => [
    state.aiSquads,
    state.setAiSquads,
  ]);

  const [isAIloading, setIsAIloading] = useState(false);
  const [nameError, setNameError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
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

  const isUserIdInTheGame = useMemo(() => {
    return players?.some(
      (participant) =>
        session?.user?.id && participant.userId === session.user.id
    );
  }, [players, session?.user.id]);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    // Check if user name is in shape of "name atLeast3CharactersSurname"

    const name = data.name.split(" ");
    if (name.length < 2) {
      setNameError("Podaj imię i nazwisko");
      return;
    }
    if (name[0].length < 3) {
      setNameError("Imię musi mieć co najmniej 3 litery");
      return;
    }
    if (name[1].length < 3) {
      setNameError("Nazwisko musi mieć co najmniej 3 litery");
      return;
    }

    // Check if user from data with the same name is already in the game
    const isUserNameInTheGame = players?.some(
      (participant) => participant.name === data.name
    );

    if (isUserNameInTheGame) {
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

    const userId =
      data.isAnonymous || isUserIdInTheGame ? undefined : session?.user?.id;

    if (!game?.id) return;
    const player: Player = {
      id: uuidv4(),
      name: data.name,
      role,
      gameId: game.id,
      userId,
      skill: data.skill.value,
      shape: data.shape.value,
      order: (game.players ?? []).length + 1,
    };
    await supabase.from("players").insert([player]);
    // Add name to name array in local storage
    if (typeof window !== "undefined") {
      const names = JSON.parse(localStorage.getItem("names") ?? "[]");
      const nameWithGameId = `${data.name}|${game.id}`;
      if (!names.includes(nameWithGameId)) {
        localStorage.setItem(
          "names",
          JSON.stringify([...names, nameWithGameId])
        );
      }
    }

    router.refresh();
    closeModal();
    reset();
  };

  useEffect(() => {
    window.onpopstate = () => {
      router.refresh();
    };
  }, [router]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openSquadModal = () => {
    handleAI();
    setSquadIsOpen(true);
  };

  const closeSquadModal = () => {
    setSquadIsOpen(false);
  };

  const openAiSquadModal = () => {
    setAiSquadIsOpen(true);
  };

  const closeAiSquadModal = () => {
    setAiSquadIsOpen(false);
  };

  const openRemoveModal = () => {
    setRemoveIsOpen(true);
  };

  const closeRemoveModal = () => {
    setRemoveIsOpen(false);
  };

  const handleDeleteGame = async () => {
    if (!game?.id) return;

    const playersWithoutUserId = players.filter((player) => !player.userId);
    const playersWithUserId = players.filter((player) => player.userId);

    // Update players with userId to have gameId = null
    await supabase
      .from("players")
      .update({ gameId: null })
      .in(
        "id",
        playersWithUserId.map((player) => player.id)
      );

    // Delete players without userId
    await supabase
      .from("players")
      .delete()
      .in(
        "id",
        playersWithoutUserId.map((player) => player.id)
      );

    // Delete game
    await supabase.from("games").delete().eq("id", game.id);

    router.refresh();
    router.push("/admin");
  };

  const canManage =
    game.creator !== undefined && session?.user.id === game.creator;

  const handleChangeAnonRemoveFlag = async (value: boolean) => {
    if (!game?.id) return;
    await supabase
      .from("games")
      .update({ canAnonRemove: value })
      .eq("id", game.id);
    router.refresh();
  };

  const handleAI = async () => {
    setIsAIloading(true);
    try {
      const res = await splitTeams(inputAIPlayers);
      setAiSquads(res);
    } finally {
      setIsAIloading(false);
    }
  };

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
        deleteGame={canManage ? openRemoveModal : undefined}
        canAnonRemove={game.canAnonRemove ?? false}
        onAnonRemoveFlagChange={handleChangeAnonRemoveFlag}
        canManage={canManage}
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
                <p className="text-red-500 text-md">{nameError}</p>
                <input
                  className="bg-gray-50 mb-4 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Imię i Nazwisko"
                  defaultValue={userData?.full_name ?? ""}
                />

                <label className="block bg-gray-50 mb-2 text-sm font-medium text-gray-900 border p-2 rounded-md  ">
                  Gdzie wolisz grać ? (wybierz z listy) <br />
                  <span className="font-small text-xs text-gray-600">
                    Jeżeli jest ci to obojętne, dostaniesz losową pozycje której
                    jest akurat najmniej, tak aby było łatwo podzielić skład
                  </span>
                </label>
                <AppListBox
                  padding="py-2"
                  name="role"
                  control={control}
                  items={[
                    { value: "None", name: "Obojętne" },
                    { value: "GK", name: "Gruby na brame" },
                    { value: "DF", name: "Obrona" },
                    { value: "MF", name: "Pomoc" },
                    { value: "FW", name: "Napad" },
                  ]}
                />
                <label className="block my-2 text-sm font-medium text-gray-900    ">
                  Forma
                </label>
                <AppListBox
                  padding="py-2"
                  name="shape"
                  control={control}
                  items={[
                    { value: "3", name: "Średnia forma" },
                    { value: "4", name: "Będzie biegane" },
                    { value: "1", name: "Dawno nie grałem" },
                    { value: "2", name: "Coś tam boli ale mogę grać" },
                  ]}
                />
                <label className="block my-2 text-sm font-medium text-gray-900    ">
                  Umiejętności
                </label>
                <AppListBox
                  padding="py-2"
                  name="skill"
                  control={control}
                  items={[
                    { value: "2", name: "Średni" },
                    { value: "1", name: "Rekreacyjny" },
                    { value: "3", name: "Dobry" },
                    { value: "4", name: "Bardzo dobry" },
                    { value: "5", name: "Gram w klubie regularnie" },
                  ]}
                />
                <div className="flex gap-2 py-4 items-center w-full justify-between">
                  {isUserIdInTheGame ? (
                    <p className="block mb-2 text-sm font-medium text-gray-900">
                      Jesteś już zapisany jako{" "}
                      <span className="font-bold text-cyan-700">
                        {userData?.full_name ?? ""}
                      </span>
                      . Możesz dopisać innego gracza podając jego imię, będzie
                      on zapisany anonimowo.
                    </p>
                  ) : session?.user ? (
                    <>
                      <div className="flex flex-col">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Czy chcesz się zapisać anonimowo ?
                        </label>
                        <p className="text-gray-700 text-xs">
                          Jesteś zalogowany jako{" "}
                          <span className="font-bold text-cyan-700">
                            {userData?.full_name ?? ""}
                          </span>{" "}
                          ale możesz zapisać się anonimowo. Jeżeli to zrobisz,
                          ten mecz nie będzie widoczny w twoim profilu.
                        </p>
                      </div>
                      <Controller
                        name="isAnonymous"
                        control={control}
                        render={({ field }) => (
                          <AppSwitch
                            {...field}
                            disabled={isUserIdInTheGame}
                            srOnlyLabel="Zapisuje się anonimowo"
                            checked={isUserIdInTheGame ? true : field.value}
                            onChange={(e) => field.onChange(e)}
                          />
                        )}
                      />
                    </>
                  ) : null}
                </div>
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
            buttonColor="red"
            isOpen={squadModalIsOpen}
            openModal={openSquadModal}
            closeModal={closeSquadModal}
            title="Sugerowane składy AI"
            buttonLabel="Poka składy AI (beta)"
            full
            buttonPadding="px-4 py-3"
          >
            <div className="">
              <p className="font-bold py-4">FC Ziomale</p>

              {aiSquads && aiSquads[0]
                ? aiSquads[0].map((player, index) => {
                    return (
                      <div key={player.id}>
                        <PlayerCell dark player={player} index={index + 1} />
                      </div>
                    );
                  })
                : isAIloading
                ? "ładuje..."
                : "brak składu"}
            </div>
            <div className="pb-4">
              <p className="font-bold pt-6 pb-4">Mordeczki United</p>
              {aiSquads && aiSquads[1]
                ? aiSquads[1].map((player, index) => {
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
                  })
                : isAIloading
                ? "ładuje..."
                : "brak składu"}
            </div>
            <Button bold full onClick={closeSquadModal}>
              Ok
            </Button>
          </AppDialog>
          <AppDialog
            closeOnTitle
            buttonColor="green"
            isOpen={aiSquadModalIsOpen}
            openModal={openAiSquadModal}
            closeModal={closeAiSquadModal}
            title="Sugerowane składy"
            buttonLabel="Składy"
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
            <Button bold full onClick={closeAiSquadModal}>
              Ok
            </Button>
          </AppDialog>
        </div>
        {canManage ? (
          <SquadComposerModal
            gameId={game.id}
            isGameCustomTeams={game.customTeams}
            numberOfPlayers={game.numberOfPlayers ?? 2}
          />
        ) : null}

        {/* Remove dialog */}
        <AppDialog
          isOpen={modalRemoveIsOpen}
          openModal={openRemoveModal}
          closeModal={closeRemoveModal}
          closeOnTitle={false}
          title={"Czy na pewno chcesz usunąć grę?"}
          buttonLabel=""
          buttonColor="red"
        >
          <div className={`flex py-4 flex-row space-x-4 justify-center`}>
            <Button color="red" onClick={handleDeleteGame}>
              Usuń
            </Button>
            <Button color="gray" onClick={closeRemoveModal}>
              Anuluj
            </Button>
          </div>
        </AppDialog>
      </Stats>
    </div>
  );
}
