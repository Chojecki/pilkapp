import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { Player } from "../domain/game/game";
import Button from "./button";
import AppDialog from "./dialog";
import AppSwitch from "./switch";

const PlayerCell = ({
  player,
  index,
  onClick,
  bench = false,
  onSwitchClick,
}: {
  player: Player;
  index: number;
  bench?: boolean;
  onClick?: () => void;
  onSwitchClick?: (checked: boolean) => void;
}) => {
  const { user } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="flex flex-row bg-white shadow-sm rounded p-4 w-full">
      <div
        className={`flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl ${
          bench ? "bg-pink-100" : "bg-cyan-100"
        } text-cyan-900`}
      >
        <p className="font-bold">#{index}</p>
      </div>
      <div className="flex flex-col items-start justify-center flex-grow ml-4">
        <div className="font-bold text-lg">
          {player.name} <span>({player.role})</span>
        </div>
      </div>
      {user.uid && onSwitchClick && (
        <div className="flex justify-center items-center pr-2">
          <AppSwitch
            symbol="$"
            checked={Boolean(player.didPay)}
            onChange={onSwitchClick ?? (() => {})}
          />
        </div>
      )}
      {user.uid && onClick && (
        <AppDialog
          isOpen={modalIsOpen}
          openModal={openModal}
          closeModal={closeModal}
          title="Czy na pewno chcesz usunąć gracza?"
          buttonLabel="Usuń"
          buttonColor="red"
        >
          <div className="flex py-4 flex-row space-x-4 justify-center">
            <Button color="red" onClick={onClick}>
              Usuń
            </Button>
            <Button color="gray" onClick={closeModal}>
              Anuluj
            </Button>
          </div>
        </AppDialog>
      )}
    </div>
  );
};

export default PlayerCell;
