import React from "react";
import { Player } from "../domain/game/game";

type SoccerFieldProps = {
  players: Player[];
};

const FootballField: React.FC<SoccerFieldProps> = ({ players }) => {
  return (
    <svg viewBox="0 0 120 120" className="h-64 w-full">
      <rect x="10" y="10" width="100" height="100" fill="#1c9e1c" />
      <rect x="10" y="10" width="100" height="20" fill="#fff" />
      <rect x="10" y="90" width="100" height="20" fill="#fff" />
      <rect x="10" y="30" width="20" height="60" fill="#fff" />
      <rect x="90" y="30" width="20" height="60" fill="#fff" />
      <circle cx="60" cy="60" r="20" fill="#fff" />
      <circle cx="60" cy="60" r="6" fill="#1c9e1c" />
    </svg>
  );
};

function getPosition(role: Player["role"]) {
  switch (role) {
    case "GK":
      return "bottom-0 right-0";
    case "DF":
      return "bottom-0 left-0";
    case "MF":
      return "top-0 left-0";
    case "FW":
      return "top-0 right-0";
    default:
      return "";
  }
}

export default FootballField;
