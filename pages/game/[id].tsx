import { GetServerSideProps } from "next";
import router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { gameController } from "../../application/game/game_controller";

import { Game } from "../../domain/game/game";

type Input = {
  name: string;
};

export default function GamePage({ game }: { game: Game }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = async (data) => {
    await gameController.updateGame(game.id, data.name);
    router.replace(router.asPath);
  };

  return (
    <div className="p-6">
      <p>Gra: {game.name}</p>
      <p>Opis: {game.description}</p>
      <p>Data: {game.date}</p>
      <p>Cena: {game.price}</p>
      <p>Lokalizacja: {game.place}</p>
      <p>Gracze: {game.participants}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          {...register("name", { required: true })}
          placeholder="Imię"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Zapisz się
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const game = await gameController.getGame(id as string);

  return {
    props: {
      game,
    },
  };
};
