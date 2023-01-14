"use client";

import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Player } from "../domain/game/game";
import { createBrowserClient } from "../utils/supabase-browser";
import PlayerCell from "./player-cell";
import { useSupabase } from "./supabase-provider";

export default function GamePlayersList({
  splitedPlayers,
  gameCreator,
  canAnonRemove,
  gameName,
  creatorEmail,
  ignoreLocalStorage,
  isGamePublic,
}: {
  splitedPlayers: { mainSquad: Player[]; bench: Player[] };
  gameCreator: string | null;
  canAnonRemove: boolean;
  gameName: string;
  creatorEmail?: string;
  ignoreLocalStorage?: boolean;
  isGamePublic: boolean;
}) {
  const router = useRouter();
  const { session } = useSupabase();
  const supabase = createBrowserClient();

  const handleSendEmail = async (playerName: string) => {
    const isOrganisatorRemoving = session?.user.id;
    if (!creatorEmail || isOrganisatorRemoving !== undefined) {
      return;
    }

    const isPlayerNameOnBench = splitedPlayers.bench.some(
      (player) => player.name === playerName
    );

    // Do fetch POST to /api/contact
    const inputData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playerName,
        adminEmail: creatorEmail,
        gameName: gameName,
        isPlayerNameOnBench: isPlayerNameOnBench ? "true" : "false",
        nextInLine:
          splitedPlayers.bench[0] !== undefined
            ? splitedPlayers.bench[0].name
            : "brak",
      }),
    };

    await fetch(`/api/contact`, inputData);
  };

  const hanldePlayerDelete = async (player: Player) => {
    await supabase.from("players").delete().eq("id", player.id);

    handleSendEmail(player.name);

    // Check if client side
    if (typeof window !== "undefined") {
      // Remove player name if exist from local storage names array
      const names = localStorage.getItem("names");
      if (names) {
        const namesArray = JSON.parse(names);
        const filteredNames = namesArray.filter(
          (name: string) => name !== player.name
        );
        localStorage.setItem("names", JSON.stringify(filteredNames));
      }
    }

    router.refresh();
  };

  const handleSelectDidPay = async (player: Player, didPay: boolean) => {
    await supabase.from("players").update({ didPay }).eq("id", player.id);
    router.refresh();
  };

  const [appear, setAppear] = useState(false);

  useEffect(() => {
    setAppear(true);

    return () => {
      setAppear(false);
    };
  }, []);

  const canManage = gameCreator !== null && session?.user.id === gameCreator;
  return (
    <>
      {splitedPlayers.mainSquad.length > 0 ? (
        <div className="p-4 w-full bg-gradient-to-r from-sky-900 via-sky-800 to-sky-800 ... ">
          <h3 className="text-2xl font-extrabold text-white pb-4">Grają:</h3>
          <div className="flex flex-col gap-3 w-full">
            {splitedPlayers.mainSquad.map((participant, index) => (
              <Transition
                key={participant.id}
                as={Fragment}
                appear={appear}
                show
                enter="ease-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="w-full">
                  <PlayerCell
                    onClick={() => hanldePlayerDelete(participant)}
                    index={index + 1}
                    canManage={canManage}
                    canAnonRemove={canAnonRemove}
                    player={participant}
                    isLoading={false}
                    ignoreLocalStorage={ignoreLocalStorage}
                    onSwitchClick={(checked) => {
                      handleSelectDidPay(participant, checked);
                    }}
                  />
                </div>
              </Transition>
            ))}
          </div>
          <h3 className="text-2xl font-extrabold text-white py-4">Rezerwa:</h3>
          {splitedPlayers.bench.map((participant, index) => (
            <div className="w-full" key={participant.id}>
              <PlayerCell
                bench
                canManage={canManage}
                index={index + 1}
                player={participant}
                canAnonRemove={canAnonRemove}
                ignoreLocalStorage={ignoreLocalStorage}
                onClick={() => hanldePlayerDelete(participant)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full p-4 flex items-center justify-center w-full bg-gradient-to-r from-sky-900 via-sky-800 to-sky-800 ...">
          <p className="text-white text-center text-2xl font-extrabold">
            Dodaj pierwszego gracza, aby wyświetlić listę ...
          </p>
        </div>
      )}
    </>
  );
}
