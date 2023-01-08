"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Balancer from "react-wrap-balancer";
import logo from "../assets/logo.png";
import Button from "../components/button";
import { useSupabase } from "../components/supabase-provider";

type Inputs = {
  email: string;
  password: string;
  username: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });

  const { supabase, session } = useSupabase();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEmailRegister = async (
    email: string,
    password: string,
    username: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
        },
      },
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
    await handleEmailRegister(data.email, data.password, data.username);

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

            <div className="w-full lg:w-1/2 flex flex-col gap-4 bg-white p-5 rounded-lg lg:rounded-l-none">
              <div className="px-1   text-center">
                <h3 className="pt-4 mb-2 text-2xl">Zarejestruj się</h3>
                <p className=" text-sm text-gray-700">
                  <Balancer>
                    Nie muisz posiadać konta, aby korzystać z aplikacji i
                    zapisywać się na mecze. Jednak jeśli chcesz mieć dostęp
                    tworzenia własnych meczy oraz swojego konta w którym
                    będziesz mógł analizować swoją grę, musić być zalogowany.
                  </Balancer>
                </p>
              </div>
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <input
                  className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  placeholder="Email"
                  {...register("email", { required: true })}
                />

                <input
                  className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  {...register("password", { required: true })}
                  placeholder="Hasło"
                />

                <input
                  className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  {...register("username", { required: true })}
                  placeholder="Nazwa użytkownika"
                />

                {errors.password && <span>This field is required</span>}

                <Button disabled={!isValid || isSubmitting} full bold>
                  {isPending ? "Ładowanie ..." : "Zarejestruj"}
                </Button>
              </form>
              <Link className="text-sm" href="/privacy">
                Rejestrując się, akceptujesz politykę prywatności dostępna{" "}
                <span className="text-blue-600 mx-1 font-bold underline hover:cursor-pointer">
                  tutaj
                </span>
              </Link>
              <Link className="text-sm" href="/login">
                Masz konto?
                <span className="text-blue-600 mx-1 font-bold underline hover:cursor-pointer">
                  Tutaj się zalogujesz
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
