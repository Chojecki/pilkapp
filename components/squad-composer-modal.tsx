"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import useSWR from "swr";
import { Player } from "../domain/game/game";
import { createBrowserClient } from "../utils/supabase-browser";
import Button from "./button";
import AppDialog from "./dialog";
import PlayerCell from "./player-cell";
import AppSwitch from "./switch";

interface Props {
  gameId: string;
  isGameCustomTeams: boolean;
}

export default function SquadComposerModal({
  gameId,
  isGameCustomTeams,
}: Props) {
  const supabase = createBrowserClient();
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(isGameCustomTeams);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { data: playersOfTheGame, mutate } = useSWR(
    `playersOf-${gameId}`,
    async () => {
      const a = await supabase
        .from("players")
        .select("*")
        .eq("gameId", gameId)
        .order("created_at", { ascending: true });
      return a.data;
    }
  );

  const handleChangeSquad = async (playerId: string, currentTeam: number) => {
    await supabase
      .from("players")
      .update({ team: currentTeam === 1 ? 2 : 1 })
      .eq("id", playerId);

    const arrayOfPlayers = playersOfTheGame;
    if (arrayOfPlayers) {
      // Swap player
      const playerIndex = arrayOfPlayers.findIndex(
        (player) => player.id === playerId
      );
      arrayOfPlayers[playerIndex].team = currentTeam === 1 ? 2 : 1;

      mutate([...arrayOfPlayers]);

      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleSave = async () => {
    await supabase
      .from("games")
      .update({ customTeams: checked })
      .eq("id", gameId);

    startTransition(() => {
      router.refresh();
    });

    setIsOpen(false);
  };

  return (
    <AppDialog
      isOpen={isOpen}
      openModal={() => setIsOpen(true)}
      closeModal={() => setIsOpen(false)}
      closeOnTitle={false}
      title={"Ustawienia składów"}
      buttonLabel="Ustaw składy"
      buttonColor="yellow"
    >
      <div className="felx flex-col gap-4">
        <div className="flex gap-4">
          <label>Czy chcesz sam ustawić składy ?</label>
          <AppSwitch
            srOnlyLabel="Sam chce ustawić składy"
            checked={checked}
            onChange={(checked) => setChecked(checked)}
          />
        </div>

        <div className="py-4">
          <Button color="green" full bold onClick={handleSave}>
            {isPending ? "Zapisuje ..." : "Zapisz"}
          </Button>
        </div>

        {checked &&
          playersOfTheGame &&
          playersOfTheGame.map((player, index) => (
            <div key={player.id}>
              <PlayerCell
                dark
                bench={player.team === 2}
                player={player as Player}
                index={index + 1}
                onActionClick={() =>
                  handleChangeSquad(player.id, player.team ?? 1)
                }
              />
            </div>
          ))}
      </div>
    </AppDialog>
  );
}
