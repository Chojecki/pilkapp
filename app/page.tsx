"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/button";
import { useAuth } from "../context/auth-context";
import { Game } from "../domain/game/game";
import { firebaseAuthRepository } from "../infrastructure/auth/auth_facade";
import { firebaseGameRepo } from "../infrastructure/game/game_repo";
import { gamesCollectionRef } from "../utils/firebaseConfig";

type GameCrateInputs = {
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
  numberOfPlayers?: number;
  time?: string;
};

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { games, isLoading, isError, refetch } = useGetGames();

  useEffect(() => {
    if (!user.uid) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [router, user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<GameCrateInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<GameCrateInputs> = async (data) => {
    const { name, description, date, price, place, numberOfPlayers, time } =
      data;
    const id = uuidv4();
    const game: Game = {
      id,
      name,
      description,
      date,
      price,
      place,
      creator: user.uid,
      participants: [],
      numberOfPlayers: numberOfPlayers || 14,
      time: time || "20:30",
    };
    try {
      await setDoc(doc(gamesCollectionRef, game.id), { ...game });
    } catch (e) {
      console.log(e);
    }

    return router.push(`/game/${id}`);
  };

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("name", { required: true })}
          placeholder="Nazwa"
          defaultValue="Kopanie się po twarzach"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("description")}
          placeholder="Opis"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("date", { required: true })}
          placeholder="Data"
          type="date"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("time")}
          defaultValue="20:30"
          placeholder="Godzina (opcjonalnie, domyślnie 20:30)"
          type="time"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("price", { required: true })}
          placeholder="Opłata"
          type="number"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("numberOfPlayers")}
          placeholder="Liczba graczy (opcjonalnie, domyślnie 14)"
          type="number"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("place", { required: true })}
          placeholder="Miejsce/Adres"
        />

        {errors.date && <p className="text-red-500">To pole jest wymagane</p>}

        <Button disabled={!isValid || isSubmitting}>Stwórz</Button>
      </form>
      <Button
        type="button"
        onClick={async () => await firebaseAuthRepository.logout()}
      >
        Wyloguj
      </Button>
      <div className="py-4">
        <h2 className="mb-6 md:text-3xl lg:text-3xl">Twoje Gry:</h2>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}
        {games?.map((game, index) => (
          <div
            key={game.id}
            onMouseEnter={async () => {
              await queryClient.prefetchQuery({
                queryKey: ["game", game.id],
                queryFn: () =>
                  firebaseGameRepo.getGame(game.id).then((res) => res),
                staleTime: 10 * 1000, // only prefetch if older than 10 seconds
              });

              await queryClient.prefetchQuery({
                queryKey: ["participants", game.id],
                queryFn: () =>
                  firebaseGameRepo.getParticipants(game.id).then((res) => res),
                staleTime: 10 * 1000, // only prefetch if older than 10 seconds
              });
            }}
            className="flex flex-row bg-white shadow-sm rounded p-4 w-full"
          >
            <Link className="flex" href={`/game/${game.id}`}>
              <div
                className={`flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-green-400 text-cyan-900`}
              >
                <p className="font-bold">#{index + 1}</p>
              </div>
              <div className="flex flex-col items-start justify-center flex-grow ml-4">
                <div className="font-bold text-lg">
                  {game.name} <span>({game.date})</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

const useGetGames = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery<Game[], Error>({
    queryKey: ["games", user.uid],
    queryFn: () => firebaseGameRepo.getGames(user.uid).then((res) => res),
  });

  return { games: data, isLoading, isError, refetch };
};
