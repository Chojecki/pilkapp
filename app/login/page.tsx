"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../components/button";
import { useSupabase } from "../../components/supabase-provider";

type Inputs = {
  email: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const { supabase } = useSupabase();

  const handleEmailLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log({ error });
    }
  };
  const handleEmailRegister = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    await supabase.auth;

    if (error) {
      console.log({ error });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log({ error });
    }
  };
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await handleEmailLogin(data.email, data.password);

    window.location.reload();
  };

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          defaultValue=""
          {...register("email", { required: true })}
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          {...register("password", { required: true })}
        />

        {errors.password && <span>This field is required</span>}

        <Button>login</Button>
      </form>
      <Button onClick={handleLogout}>logout</Button>
    </>
  );
}
