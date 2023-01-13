"use client";

import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

import { Fragment, useState } from "react";
import useSWR from "swr";
import { createBrowserClient } from "../utils/supabase-browser";

export default function CityPicker(props: { search?: string }) {
  const router = useRouter();

  const supabase = createBrowserClient();
  const { data: allGames } = useSWR(`allGames-public`, async () => {
    const query = await supabase
      .from("games")
      .select("*, players(*)")
      .order("created_at", {
        ascending: true,
      })
      .eq("isPublic", true);

    return query.data;
  });

  const citiesOfGames = allGames?.map((game) => game.city);
  const citiesOfGamesWithoutDuplicates = citiesOfGames?.filter(
    (city, index) => citiesOfGames.indexOf(city) === index
  );
  const cities = ["Wszystkie", ...(citiesOfGamesWithoutDuplicates ?? [])] || [
    "Wszystkie",
  ];

  const selected = props.search ?? cities[0];
  const [query, setQuery] = useState("");

  const filteredcities =
    query === ""
      ? cities
      : cities.filter((city) =>
          (city ?? "")
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div>
      <Combobox
        value={selected}
        onChange={(value) => {
          if (value !== "Wszystkie") {
            router.push(`/public-games?search=${value}`);
          } else {
            router.push(`/public-games`);
          }
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-ful h-[60px] w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Wpisz miasto"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredcities.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nic nie znaleziono
                </div>
              ) : (
                filteredcities.map((city) => (
                  <Combobox.Option
                    key={city}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={city}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {city}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
