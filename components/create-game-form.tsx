"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
  creatorContact?: string;
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
    mode: "onSubmit",
  });

  const [isPending, startTransition] = useTransition();

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
      date: new Date(date).toISOString(),
      price,
      place,
      creator: session.user.id,
      numberOfPlayers: numberOfPlayers || 14,
      time: time || "20:30",
      creatorContact: data.creatorContact,
    };
    try {
      const data = await supabase.from("games").insert([{ ...game }]);
      startTransition(() => {
        router.refresh();

        if (data) {
          router.push(`/game/${id}`);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-fuchsia-900 to-fuchsia-600  py-4">
        Stwórz nową grę
      </h2>
      <form
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="bg-gray-50 col-span-2  my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("name", { required: true })}
          placeholder="Nazwa"
        />

        <input
          className="bg-gray-50 col-span-2 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("description")}
          placeholder="Opis"
        />

        <input
          className="bg-gray-50 col-span-2 md:col-span-1 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("date", { required: true })}
          placeholder="Data"
          type="date"
        />

        <input
          className="bg-gray-50 col-span-2 md:col-span-1 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("time")}
          defaultValue="20:30"
          placeholder="Godzina (opcjonalnie, domyślnie 20:30)"
          type="time"
        />

        <input
          className="bg-gray-50 col-span-2 md:col-span-1 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("price", { required: true })}
          placeholder="Opłata"
          type="number"
        />

        <input
          className="bg-gray-50 col-span-2 md:col-span-1 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("numberOfPlayers")}
          placeholder="Liczba graczy (opcjonalnie, domyślnie 14)"
          type="number"
        />

        <input
          className="bg-gray-50 col-span-2 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("place", { required: true })}
          placeholder="Miejsce/Adres"
        />

        <input
          className="bg-gray-50 col-span-2 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("creatorContact", { required: true })}
          placeholder="Kontakt do organizatora"
        />

        {errors.name && <p className="text-red-500">Nazwa jest wymagana</p>}
        {errors.date && <p className="text-red-500">Data jest wymagana</p>}
        {errors.price && <p className="text-red-500">Opłata jest wymagana</p>}
        {errors.place && <p className="text-red-500">Miejsce jest wymagane</p>}
        {errors.creatorContact && (
          <p className="text-red-500">Kontakt jest wymagany</p>
        )}

        <div className="col-span-2 w-full">
          <Button full bold disabled={!isValid || isSubmitting || isPending}>
            {isSubmitting || isPending
              ? "Tworzę grę"
              : !isValid
              ? "Uzupełnij wymagane pola"
              : "Stwórz"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CrateGameForm;
