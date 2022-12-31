"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import logo from "../assets/logo.png";
import Button from "./button";
import { useSupabase } from "./supabase-provider";

type Inputs = {
  email: string;
  password: string;
  username: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });

  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEmailLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      window.location.replace("/");
    }
  }, [session]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await handleEmailLogin(data.email, data.password);
    setLoading(true);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="bojo flex items-center h-screen">
      <div className="container mx-auto">
        <div className="flex justify-center px-6 my-12">
          <div className="w-full shadow-2xl xl:w-3/4 lg:w-11/12 flex">
            <div className="w-full h-auto bg-green-900 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg">
              <Image
                src={logo}
                alt="logo"
                className="w-full h-full"
                sizes="490px 490px"
              />
            </div>

            <div className="w-full flex flex-col gap-5 lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
              <div className="px-8 mb-4 text-center">
                <h3 className="pt-4 mb-2 text-2xl">Zaloguj się</h3>
              </div>
              <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
                <input
                  className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  placeholder="Email"
                  {...register("email", { required: true })}
                />

                <input
                  className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  {...register("password", { required: true })}
                  placeholder="hasło"
                />

                <Button full bold>
                  {isSubmitting || loading || isPending
                    ? "Logowanie ..."
                    : "Zaloguj się"}
                </Button>
              </form>
              <Link className="text-sm" href="/register">
                Nie masz konta?{" "}
                <span className="text-blue-600 font-bold underline hover:cursor-pointer">
                  Tutaj je stworzysz
                </span>{" "}
                Pamiętaj, że możesz używać zapisywać się na mecze bez logowania.
                Potrzebujesz tylko linku do meczu od organizotora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
