import dayjs from "dayjs";
import Link from "next/link";
import { Game } from "../domain/game/game";

interface PublicGameCellProps {
  game: Game;
}

export default function PublicGameCell(props: PublicGameCellProps) {
  const { game } = props;
  const { name, description, city, numberOfPlayers, players, date, price } =
    game;

  const playersCount = players?.length || 0;
  const gameCity = city || "Brak miasta";

  return (
    <Link href={`game/${game.id}`}>
      <div className="border bg-white border-gray-200 p-6 shadow-sm rounded-lg hover:cursor-pointer hover:border-teal-700">
        <div className="pb-3 flex items-center justify-between">
          <h2 className="text-lg text-gray-900 font-extrabold title-font mb-2">
            {gameCity}
          </h2>
          <div className="flex items-center gap-2">
            <p className="font-extrabold ">{`${dayjs(date).format(
              "DD.MM"
            )}`}</p>

            <div className="flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-xl bg-fuchsia-100 text-fuchsia-600">
              <svg
                className="w-4 h-4"
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
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-xl bg-sky-100 text-blue-500">
              <svg
                className="w-4 h-4"
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
            </div>
            <p
              className={`font-extrabold ${
                playersCount > (numberOfPlayers ?? 0)
                  ? "text-red-700"
                  : "text-teal-600"
              }`}
            >{`${playersCount} / ${numberOfPlayers ?? 0}`}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className={`font-extrabold `}>{`${price} PLN`}</p>
            <div className="flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-xl bg-teal-100 text-teal-500">
              <svg
                className="w-4 h-4"
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
            </div>
          </div>
        </div>
        <div className="pt-4">
          <h2 className="text-md text-gray-900 line-clamp-3  title-font mb-2">
            {name}
          </h2>
        </div>
      </div>
    </Link>
  );
}
