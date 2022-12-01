import { useAuth } from "../context/auth-context";
import { Player } from "../domain/game/game";
import Button from "./button";

const PlayerCell = ({
  player,
  index,
  onClick,
  bench = false,
}: {
  player: Player;
  index: number;
  bench?: boolean;
  onClick?: () => void;
}) => {
  const { user } = useAuth();

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
      {user.uid && onClick && <Button onClick={onClick}>Usuń</Button>}
    </div>
  );
};

export default PlayerCell;
