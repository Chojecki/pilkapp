"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../components/button";
import { useAuth } from "../../context/auth-context";
import { firebaseAuthRepository } from "../../infrastructure/auth/auth_facade";

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

  const { user } = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await firebaseAuthRepository.login(data.email, data.password);
    return router.push("/");
  };

  useEffect(() => {
    if (!user.uid) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [router, user]);

  return (
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
  );
}
