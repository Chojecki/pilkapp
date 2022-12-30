import React from "react";
import CrateGameForm from "../../components/create-game-form";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 h-screen md:grid-cols-3">
      <div className="col-span-2 md:overflow-y-scroll md:h-screen">
        <CrateGameForm />
      </div>
      <div className="bojo pb-8 md:overflow-y-scroll h-full md:h-screen col-span-1">
        {children}
      </div>
    </div>
  );
}
