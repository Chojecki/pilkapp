"use client";

import { useMemo, useState } from "react";
import Balancer from "react-wrap-balancer";
import { Player } from "../domain/game/game";
import Button from "./button";
import AppDialog from "./dialog";

const PlayerCell = ({
  player,
  index,
  onClick,
  onActionClick,
  bench = false,
  onSwitchClick,
  isLoading,
  canManage = false,
  dark = false,
  canAnonRemove = false,
  secondary = false,
  ignoreLocalStorage = false,
}: {
  player: Player;
  index: number;
  bench?: boolean;
  onClick?: () => void;
  onActionClick?: () => void;
  isLoading?: boolean;
  onSwitchClick?: (checked: boolean) => void;
  canManage?: boolean;
  dark?: boolean;
  secondary?: boolean;
  canAnonRemove?: boolean;
  ignoreLocalStorage?: boolean;
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  // Get array of names from localStorage and check if player name is in it
  const isNameInLocalStorage = useMemo(() => {
    if (ignoreLocalStorage) {
      return true;
    }
    if (typeof window !== "undefined") {
      const names = JSON.parse(localStorage.getItem("names") || "[]");
      const nameWithGameId = `${player.name}|${player.gameId}`;
      return names.find((name: string) => name === nameWithGameId);
    } else {
      return false;
    }
  }, [ignoreLocalStorage, player.gameId, player.name]);

  const canRemove = useMemo(() => {
    return canManage || canAnonRemove;
  }, [canManage, canAnonRemove]);

  return (
    <div className="flex flex-row squad-list bg-transparent  border-b-2 border-sky-100 p-4 w-full">
      <div
        className={`flex items-center justify-center border-2 border-white flex-shrink-0 h-12 w-12 rounded-xl ${
          bench ? "bg-rose-700" : secondary ? "bg-fuchsia-700" : "bg-blue-600"
        } text-white`}
      >
        <p className="font-bold">#{index}</p>
      </div>
      <div className="flex flex-col items-start justify-center flex-grow ml-4">
        <div
          className={`font-bold ${
            dark ? "text-stone-800" : "text-white"
          } text-lg`}
        >
          {player.name} <span>({player.role})</span>
        </div>
      </div>
      {canManage && onSwitchClick && (
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
      {onActionClick && <Button onClick={onActionClick}>Zmień team</Button>}
      {onClick && (
        <AppDialog
          isOpen={modalIsOpen}
          openModal={openModal}
          closeModal={closeModal}
          closeOnTitle={!canManage}
          title={
            canRemove
              ? "Czy na pewno chcesz usunąć gracza?"
              : "Skontaktuj się z organizatorem"
          }
          buttonLabel="Usuń"
          buttonColor="red"
        >
          <div
            className={`flex py-4 flex-row space-x-4 ${
              canRemove ? "justify-center" : ""
            }`}
          >
            {canRemove ? (
              <>
                {isNameInLocalStorage || canManage ? (
                  <>
                    <Button color="red" onClick={onClick}>
                      Usuń
                    </Button>
                    <Button color="gray" onClick={closeModal}>
                      Anuluj
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Balancer>
                      Wyląda na to, że zapisywałeś się na innej przeglądarce lub
                      chcesz usunąć kogoś innego. W takim razie, skontaktuj się
                      z organizatorem lub skorzystaj z przeglądarki w której się
                      zapisywałeś.
                    </Balancer>
                    <label className="block bg-gray-50 mb-2 text-sm font-medium text-gray-900 border p-2 rounded-md  ">
                      Gdzie jest kontakt? <br />
                      <span className="font-small text-xs text-gray-600">
                        Jeżeli nie masz kontaktu z organizatorem, powinien on
                        być widoczny w sekcji informacyjnej
                      </span>
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-left">
                  <Balancer>
                    Organizator nie pozwala aby każdy mógł się usunąć. Chodzi o
                    to aby nie było bałaganu. Już niedługo będzie to możliwe,
                    ale na tę chwilę, poroś oranizotora o usunuęcie.
                  </Balancer>
                </p>
                <label className="block bg-gray-50 mb-2 text-sm font-medium text-gray-900 border p-2 rounded-md  ">
                  Gdzie jest kontakt? <br />
                  <span className="font-small text-xs text-gray-600">
                    Jeżeli nie masz kontaktu z organizatorem, powinien on być
                    widoczny w sekcji informacyjnej
                  </span>
                </label>
              </div>
            )}
          </div>
        </AppDialog>
      )}
    </div>
  );
};

export default PlayerCell;
