import { doc, setDoc } from "firebase/firestore";
import router from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { authController } from "../application/auth/auth_controller";
import { useAuth } from "../context/auth-context";
import { gamesCollectionRef } from "../utils/firebaseConfig";

type GameCrateInputs = {
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
};

export default function Page() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user.uid) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameCrateInputs>();

  const onSubmit: SubmitHandler<GameCrateInputs> = async (data) => {
    const { name, description, date, price, place } = data;
    const id = uuidv4();
    const game = {
      id,
      name,
      description,
      date,
      price,
      place,
      participants: ["elo"],
    };
    try {
      await setDoc(doc(gamesCollectionRef, game.id), { ...game, price: 120 });
    } catch (e) {
      console.log(e);
    }

    return router.push(`/game/${id}`);
  };

  return (
    <div className="space-y-8 p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("name", { required: true })}
        />

        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("description", { required: true })}
        />

        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("date", { required: true })}
        />

        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("price", { required: true })}
        />

        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("place", { required: true })}
        />

        {errors.name && <span>Some field is required</span>}

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          register
        </button>
      </form>
      <button onClick={async () => await authController.logout()}>
        Logout
      </button>
    </div>
  );
}
