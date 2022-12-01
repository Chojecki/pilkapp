import { doc, setDoc } from "firebase/firestore";
import router from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { authController } from "../application/auth/auth_controller";
import Button from "../components/button";
import PageWrapper from "../components/page-wrapper";
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
    formState: { errors, isValid },
  } = useForm<GameCrateInputs>({
    mode: "onChange",
  });

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
      participants: [],
    };
    try {
      await setDoc(doc(gamesCollectionRef, game.id), { ...game });
    } catch (e) {
      console.log(e);
    }

    return router.push(`/game/${id}`);
  };

  return (
    <PageWrapper>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("name", { required: true })}
          placeholder="Nazwa"
          defaultValue="Kopanie się po twarzach"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("description")}
          placeholder="Opis"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("date", { required: true })}
          placeholder="Data"
          type="date"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("price", { required: true })}
          placeholder="Opłata"
          type="number"
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("place", { required: true })}
          placeholder="Miejsce/Adres"
        />

        {errors.date && <p className="text-red-500">To pole jest wymagane</p>}

        <Button disabled={!isValid}>Stwórz</Button>
      </form>
      <Button type="button" onClick={async () => await authController.logout()}>
        Wyloguj
      </Button>
    </PageWrapper>
  );
}
