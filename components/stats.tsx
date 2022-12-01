import Image from "next/image";
import malpa from "../assets/malpa.jpeg";

interface StatsProps {
  playrsLength: number;
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
}

const Stats = ({
  playrsLength,
  name,
  date,
  description,
  price,
  place,
}: StatsProps) => {
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-12 gap-4 pb-4">
        <div className="col-span-12 sm:col-span-9 md:col-span-9">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            {name}
          </h2>
          {description && (
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl  dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <div className="col-span-12 sm:col-span-3 md:col-span-3">
          <Image src={malpa} alt="malpa" />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 md:col-span-4">
          <div className="flex flex-row bg-white shadow-sm rounded p-4">
            <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-blue-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col flex-grow ml-4">
              <div className="text-sm text-gray-500">Zapisanych</div>
              <div className="font-bold text-lg">{playrsLength} / 14</div>
            </div>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-4">
          <div className="flex flex-row bg-white shadow-sm rounded p-4">
            <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-orange-100 text-orange-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col flex-grow ml-4">
              <div className="text-sm text-gray-500">Termin</div>
              <div className="font-bold text-lg">{date}</div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-4">
          <div className="flex flex-row bg-white shadow-sm rounded p-4">
            <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 text-red-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col flex-grow ml-4">
              <div className="text-sm text-gray-500">Hajs</div>
              <div className="font-bold text-lg">{price} PLN</div>
            </div>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-8 md:col-span-8">
          <div className="flex flex-row bg-white shadow-sm rounded p-4">
            <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-green-100 text-green-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col flex-grow ml-4">
              <div className="text-sm text-gray-500">Miejsce</div>
              <div className="font-bold text-lg">{place}</div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-4 md:col-span-4">
          <div className="flex flex-row bg-white shadow-sm rounded p-4">
            <div className="flex flex-col flex-grow ml-4">
              <div className="text-sm text-gray-500">
                Jeżeli chcesz się usunąć, napisz do organizatora
              </div>
              <div className="font-bold ">
                Hajs możliwy na BLIKA lub gotówka na miejscu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
