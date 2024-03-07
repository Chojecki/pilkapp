"use client";

import Image from "next/image";
import React from "react";
import field from "../assets/field.jpg";
import { Player } from "../domain/game/game";
import { useSquadStore } from "./game-stats-panel";
import AppSwitch from "./switch";

type SoccerFieldProps = {
  squds: Player[][];
};

const FootballField: React.FC<SoccerFieldProps> = ({ squds }) => {
  const [aiSquads] = useSquadStore((state) => [state.aiSquads]);
  const [suggestedSquds, setDisplayedSquds] = React.useState<Player[][]>(squds);
  return (
    <div className="relative tablet:w-[520px] tablet:h-[300px] laptop:w-[650px] laptop:h-[420px]">
      <Image
        fill
        src={field}
        alt="Soccer field"
        sizes={"650px, 420px"}
        priority
      />
      {aiSquads && aiSquads.length > 0 && (
        <div className="flex gap-4 justify-center items-center">
          <AppSwitch
            checked={suggestedSquds === aiSquads}
            onChange={(cheked) => {
              if (cheked && aiSquads.length > 0) {
                setDisplayedSquds(aiSquads);
              } else {
                setDisplayedSquds(squds);
              }
            }}
            srOnlyLabel="Switch to AI"
          />
          <h3 className="z-50 font-bold text-white">Poka składy AI</h3>
        </div>
      )}
      <div
        className={`absolute w-10 ${
          suggestedSquds[0].filter((player) => player.role === "GK").length < 4
            ? "gap-y-8"
            : suggestedSquds[0].filter((player) => player.role === "GK")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "10%" }}
      >
        {suggestedSquds[0]
          .filter((player) => player.role === "GK")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-blue-500 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
      <div
        className={`absolute w-10 ${
          suggestedSquds[0].filter((player) => player.role === "DF").length < 4
            ? "gap-y-8"
            : suggestedSquds[0].filter((player) => player.role === "DF")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "22%" }}
      >
        {suggestedSquds[0]
          .filter((player) => player.role === "DF")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-blue-500 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
      <div
        className={`absolute w-10 ${
          suggestedSquds[0].filter((player) => player.role === "MF").length < 4
            ? "gap-y-8"
            : suggestedSquds[0].filter((player) => player.role === "MF")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "32%" }}
      >
        {suggestedSquds[0]
          .filter((player) => player.role === "MF")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-blue-500 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
      <div
        className={`absolute w-10 ${
          suggestedSquds[0].filter((player) => player.role === "FW").length < 4
            ? "gap-y-8"
            : suggestedSquds[0].filter((player) => player.role === "FW")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "42%" }}
      >
        {suggestedSquds[0]
          .filter((player) => player.role === "FW")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-blue-500 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
      <div
        className={`absolute w-10 ${
          suggestedSquds[1].filter((player) => player.role === "GK").length < 4
            ? "gap-y-8"
            : suggestedSquds[1].filter((player) => player.role === "GK")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "85%" }}
      >
        {suggestedSquds[1]
          .filter((player) => player.role === "GK")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-fuchsia-300 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
      <div
        className={`absolute w-10 ${
          suggestedSquds[1].filter((player) => player.role === "DF").length < 4
            ? "gap-y-8"
            : suggestedSquds[1].filter((player) => player.role === "DF")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "72%" }}
      >
        {suggestedSquds[1]
          .filter((player) => player.role === "DF")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-fuchsia-300 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
      <div
        className={`absolute w-10 ${
          suggestedSquds[1].filter((player) => player.role === "MF").length < 4
            ? "gap-y-8"
            : suggestedSquds[1].filter((player) => player.role === "MF")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "62%" }}
      >
        {suggestedSquds[1]
          .filter((player) => player.role === "MF")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-fuchsia-300 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
      <div
        className={`absolute w-10 ${
          suggestedSquds[1].filter((player) => player.role === "FW").length < 4
            ? "gap-y-8"
            : suggestedSquds[1].filter((player) => player.role === "FW")
                .length <= 5
            ? "gap-y-3"
            : "gap-y-1"
        } flex flex-col justify-center items-center`}
        style={{ top: 0, bottom: 0, left: "52%" }}
      >
        {suggestedSquds[1]
          .filter((player) => player.role === "FW")
          .map((player, index) => (
            <div
              className="flex flex-col justify-center items-center"
              key={player.id}
            >
              <div className="  bg-fuchsia-300 rounded-full w-4 h-4 laptop:h-6 shadow-2xl shadow-gray-500/50 laptop:w-6" />
              <p
                className="text-white font-bold text-center"
                style={{ fontSize: 11 }}
              >
                {player.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FootballField;
