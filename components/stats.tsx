import dayjs from "dayjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Balancer from "react-wrap-balancer";
import Button from "./button";
import AppDialog from "./dialog";
import ItemCard from "./item-card";
import AppSwitch from "./switch";

interface StatsProps {
  playrsLength: number;
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
  numberOfPlayers: number;
  time: string;
  creatorContact?: string;
  children?: React.ReactNode;
  deleteGame?: () => void;
  canManage: boolean;
  canAnonRemove: boolean;
  onAnonRemoveFlagChange: (checked: boolean) => void;
}

const Stats = ({
  playrsLength,
  name,
  date,
  description,
  price,
  place,
  numberOfPlayers,
  time,
  creatorContact,
  children,
  deleteGame,
  canManage,
  canAnonRemove,
  onAnonRemoveFlagChange,
}: StatsProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const path = usePathname();

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  return (
    <div className="p-4 w-full flex flex-col gap-4">
      <div>
        <h2 className="mb-4 text-4xl break-words font-extrabold leading-none text-sky-200 md:text-3xl lg:text-4xl ">
          <Balancer>{name}</Balancer>
        </h2>

        {description && (
          <p className="mb-6 text-lg font-normal text-sky-100 lg:text-xl">
            <Balancer>{description}</Balancer>
          </p>
        )}
      </div>
      {path && (
        <p
          className="text-white cursor-pointer underline text-xs"
          onClick={() => {
            navigator.clipboard.writeText(`https://pilkapp.vercel.app${path}`);
            toast.success("Link skopiowany do schowka");
          }}
        >
          Skopiuj link do meczu
        </p>
      )}
      {children}
      <ItemCard
        title="Zapisanych"
        boldTitle={`${playrsLength} / ${numberOfPlayers}`}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        }
      />

      <ItemCard
        title="Termin"
        boldTitle={`${dayjs(date).format("DD.MM.YYYY")} ${time}`}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 20 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            ></path>
          </svg>
        }
      />

      <ItemCard
        title="Hajs"
        boldTitle={`${price} PLN`}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        }
      />

      <ItemCard
        title="Miejsce"
        boldTitle={place}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 20 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            ></path>
          </svg>
        }
      />

      {creatorContact && (
        <ItemCard
          title="Kontakt do organizatora"
          boldTitle={creatorContact}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                d="M16.853,8.355V5.888c0-3.015-2.467-5.482-5.482-5.482H8.629c-3.015,0-5.482,2.467-5.482,5.482v2.467l-2.741,7.127c0,1.371,4.295,4.112,9.594,4.112s9.594-2.741,9.594-4.112L16.853,8.355z M5.888,17.367c-0.284,0-0.514-0.23-0.514-0.514c0-0.284,0.23-0.514,0.514-0.514c0.284,0,0.514,0.23,0.514,0.514C6.402,17.137,6.173,17.367,5.888,17.367z M5.203,10c0-0.377,0.19-0.928,0.423-1.225c0,0,0.651-0.831,1.976-0.831c0.672,0,1.141,0.309,1.141,0.309C9.057,8.46,9.315,8.938,9.315,9.315v1.028c0,0.188-0.308,0.343-0.685,0.343H5.888C5.511,10.685,5.203,10.377,5.203,10z M7.944,16.853H7.259v-1.371l0.685-0.685V16.853z M9.657,16.853H8.629v-2.741h1.028V16.853zM8.972,13.426v-1.028c0-0.568,0.46-1.028,1.028-1.028c0.568,0,1.028,0.46,1.028,1.028v1.028H8.972z M11.371,16.853h-1.028v-2.741h1.028V16.853z M12.741,16.853h-0.685v-2.056l0.685,0.685V16.853z M14.112,17.367c-0.284,0-0.514-0.23-0.514-0.514c0-0.284,0.23-0.514,0.514-0.514c0.284,0,0.514,0.23,0.514,0.514C14.626,17.137,14.396,17.367,14.112,17.367z M14.112,10.685h-2.741c-0.377,0-0.685-0.154-0.685-0.343V9.315c0-0.377,0.258-0.855,0.572-1.062c0,0,0.469-0.309,1.141-0.309c1.325,0,1.976,0.831,1.976,0.831c0.232,0.297,0.423,0.848,0.423,1.225S14.489,10.685,14.112,10.685z M18.347,15.801c-0.041,0.016-0.083,0.023-0.124,0.023c-0.137,0-0.267-0.083-0.319-0.218l-2.492-6.401c-0.659-1.647-1.474-2.289-2.905-2.289c-0.95,0-1.746,0.589-1.754,0.595c-0.422,0.317-1.084,0.316-1.507,0C9.239,7.505,8.435,6.916,7.492,6.916c-1.431,0-2.246,0.642-2.906,2.292l-2.491,6.398c-0.069,0.176-0.268,0.264-0.443,0.195c-0.176-0.068-0.264-0.267-0.195-0.444l2.492-6.401c0.765-1.911,1.824-2.726,3.543-2.726c1.176,0,2.125,0.702,2.165,0.731c0.179,0.135,0.506,0.135,0.685,0c0.04-0.029,0.99-0.731,2.165-0.731c1.719,0,2.779,0.814,3.542,2.723l2.493,6.404C18.611,15.534,18.524,15.733,18.347,15.801z"
              ></path>
            </svg>
          }
        />
      )}
      {canManage ? (
        <AppDialog
          isOpen={deleteModalOpen}
          closeModal={closeDeleteModal}
          openModal={openDeleteModal}
          closeOnTitle
          title="Ustawienia meczu"
          buttonLabel="Ustawienia meczu"
        >
          <div className="flex item-center py-5 justify-between gap-4">
            <div className="flex flex-col gap-4">
              <label className="font-bold">
                Każdy może sam usunąć się z meczu?
              </label>
              <p>
                Główną cechą PiłkApp jest brak konieczności zakładania konta. Ma
                to ten minus, że appka nie wie kto jej używa i tym samym nie wie
                czy osoba usuwająca gracza jest na 100% tym graczem.
                <br />
                <br /> Prosty mechanizm przed tym zapobiega, ale aktywując tę
                opcję, istnieje ryzyko, że gracz będzie miał możliwość usunąć
                innego gracza jeżeli kiedykolwiek w innym meczu wpisali się tym
                samym imieniem.
                <br />
                <br />
                Dostaniesz maila z potwierdzeniem usunięcia się z meczu przez
                gracza.
              </p>
            </div>
            <AppSwitch
              srOnlyLabel="Pozwalaj anonimowym użytkownikom na usuwanie się z meczu"
              checked={canAnonRemove}
              onChange={(checked) => onAnonRemoveFlagChange(checked)}
            />
          </div>
        </AppDialog>
      ) : null}
      {deleteGame ? (
        <Button full bold onClick={deleteGame} color="red">
          Usuń mecz
        </Button>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default Stats;
