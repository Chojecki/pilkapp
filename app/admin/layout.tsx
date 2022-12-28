import React from "react";
import CrateGameForm from "../../components/create-game-form";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <CrateGameForm />
      {children}
    </div>
  );
}
