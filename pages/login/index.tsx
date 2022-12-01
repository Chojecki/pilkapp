import router from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { authController } from "../../application/auth/auth_controller";
import Button from "../../components/button";
import PageWrapper from "../../components/page-wrapper";
import { useAuth } from "../../context/auth-context";

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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await authController.login(data.email, data.password);
    return router.push("/");
  };

  useEffect(() => {
    if (!user.uid) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [user]);

  return (
    <PageWrapper>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          defaultValue="admin@pilkapp.pl"
          {...register("email", { required: true })}
        />

        <input
          className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          {...register("password", { required: true })}
        />

        {errors.password && <span>This field is required</span>}

        <Button>login</Button>
      </form>
    </PageWrapper>
  );
}
