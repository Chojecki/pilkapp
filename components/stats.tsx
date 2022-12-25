import Balancer from "react-wrap-balancer";
import ItemCard from "./item-card";

interface StatsProps {
  playrsLength: number;
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
  numberOfPlayers: number;
  time: string;
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
}: StatsProps) => {
  return (
    <div className="p-4 w-full flex flex-col gap-4">
      <div>
        <h2 className="mb-4 text-4xl break-words font-extrabold leading-none text-sky-200 md:text-3xl lg:text-6xl ">
          <Balancer> {name}</Balancer>
        </h2>

        {description && (
          <p className="mb-6 text-lg font-normal text-sky-100 lg:text-xl">
            <Balancer>{description}</Balancer>
          </p>
        )}
      </div>
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
        boldTitle={`${date} ${time}`}
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
    </div>
  );
};

export default Stats;
