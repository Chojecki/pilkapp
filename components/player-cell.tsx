import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { Player } from "../domain/game/game";
import Button from "./button";
import AppDialog from "./dialog";

const PlayerCell = ({
  player,
  index,
  onClick,
  bench = false,
  onSwitchClick,
  isLoading,
}: {
  player: Player;
  index: number;
  bench?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
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
    <div className="flex flex-row squad-list bg-transparent  border-b-2 border-sky-100 p-4 w-full">
      <div
        className={`flex items-center justify-center border-2 border-white flex-shrink-0 h-12 w-12 rounded-xl ${
          bench ? "bg-rose-700" : "bg-blue-600"
        } text-white`}
      >
        <p className="font-bold">#{index}</p>
      </div>
      <div className="flex flex-col items-start justify-center flex-grow ml-4">
        <div className="font-bold text-white text-lg">
          {player.name} <span>({player.role})</span>
        </div>
      </div>
      {user.uid && onSwitchClick && (
        <div className="flex justify-center items-center pr-2">
          <div className="form-control">
            <label className="cursor-pointer label flex">
              <span className="label-text text-white font-bold hidden md:block pr-2">
                Zapłacono
              </span>

              <div className="flex items-center ">
                <input
                  type="checkbox"
                  checked={Boolean(player.didPay)}
                  disabled={isLoading}
                  onChange={(e) => onSwitchClick(e.target.checked)}
                  id="A3-yes"
                  name="A3-confirmation"
                  value="yes"
                  className="opacity-0 absolute h-6 w-6"
                />
                <div className="bg-white border-2 rounded-md border-red-600 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                  <svg
                    className="fill-current hidden w-3 h-3 text-white pointer-events-none"
                    version="1.1"
                    viewBox="0 0 17 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fillRule="evenodd">
                      <g
                        transform="translate(-9 -11)"
                        fill="#007a10"
                        fillRule="nonzero"
                      >
                        <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </label>
          </div>
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
