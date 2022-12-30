"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "../utils/supabase-browser";
import Button from "./button";

export default function LogoutButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    router.refresh();
    router.push("/");

    if (error) {
      console.log({ error });
    }
  };

  return (
    <Button bold color="red" onClick={handleLogout}>
      {children}
    </Button>
  );
}
