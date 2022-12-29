"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/button";
import { Game } from "../domain/game/game";
import { createBrowserClient } from "../utils/supabase-browser";
import { useSupabase } from "./supabase-provider";

type GameCrateInputs = {
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
  numberOfPlayers?: number;
  time?: string;
};

const CrateGameForm = () => {
  const router = useRouter();
  const supabase = createBrowserClient();
  const { session } = useSupabase();

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
    if (!session?.user.id) {
      return;
    }
    const game: Game = {
      id,
      name,
      description,
      date,
      price,
      place,
      creator: session.user.id,
      numberOfPlayers: numberOfPlayers || 14,
      time: time || "20:30",
      creatorContact: session.user.id,
    };
    try {
      const data = await supabase.from("games").insert([{ ...game }]);

      router.refresh();

      if (data) {
        router.push(`/game/${id}`);
      }
    } catch (e) {
      console.log(e);
    }
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
    </>
  );
};

export default CrateGameForm;
