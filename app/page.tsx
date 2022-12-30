import "server-only";

// do not cache this page
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";
import Button from "../components/button";
import LogoutButton from "../components/logout-button";
import { createClient } from "../utils/supabase-server";

export default async function Page() {
  const supabase = createClient();
  const logged = (await supabase.auth.getSession()).data?.session?.user.id;
  return (
    <div className="flex flex-col justify-center items-center h-screen lg:grid-cols-3 w-full p-5 bg-white ">
      <div className="flex justify-center flex-col gap-5 items-center">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-5xl font-extrabold text-transparent  bg-clip-text bg-gradient-to-r from-sky-900 to-teal-600">
            PIŁKAPP
          </h2>
          <Image
            src={logo}
            alt="logo"
            sizes="80px 80px"
            className="object-contain w-[80px] h-[80px]"
          />
        </div>
        <h1 className="font-extrabold text-center text-transparent text-6xl lg:text-8xl bg-clip-text bg-gradient-to-r from-fuchsia-900 to-pink-600 py-4">
          Umawianie się na mecze
        </h1>
        <h3 className="font tracking-widest text-center text-transparent text-4xl lg:text-5xl bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 py-4">
          Zaprojektowane od nowa
        </h3>
        <div className="flex items-center justify-center gap-8">
          {!logged ? (
            <Link href="/login">
              <Button bold>
                <p className="text-2xl">Login</p>
              </Button>
            </Link>
          ) : (
            <LogoutButton>
              <p className="text-2xl">Wyloguj</p>
            </LogoutButton>
          )}
          {logged ? (
            <Link href="/admin">
              <Button bold>
                <p className="text-2xl">Admin</p>
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
