import { Game, Player } from "../domain/game/game";

export const suggestSquads = (mainSquad: Player[], game?: Game) => {
  // Get all players with the same role
  const goalkeepers = mainSquad.filter((player) => player.role === "GK");
  const defenders = mainSquad.filter((player) => player.role === "DF");
  const midfielders = mainSquad.filter((player) => player.role === "MF");
  const forwards = mainSquad.filter((player) => player.role === "FW");

  const squad1 = [];
  const squad2 = [];

  const halfOfPlayers = (game?.numberOfPlayers ?? 14) / 2;

  // For every GK add one to squad1 and one to squad2.
  for (let i = 0; i < goalkeepers.length; i++) {
    if (squad1.length === halfOfPlayers) {
      squad2.push(goalkeepers[i]);
    } else if (squad2.length === halfOfPlayers) {
      squad1.push(goalkeepers[i]);
    } else if (i % 2 === 0) {
      squad1.push(goalkeepers[i]);
    } else {
      squad2.push(goalkeepers[i]);
    }
  }

  // For every DF add one to squad1 and one to squad2. If one squad has (game?.numberOfPlayers ?? 14) / 2 players, add to the other one
  for (let i = 0; i < defenders.length; i++) {
    if (squad1.length === halfOfPlayers) {
      squad2.push(defenders[i]);
    } else if (squad2.length === halfOfPlayers) {
      squad1.push(defenders[i]);
    } else if (i % 2 === 0) {
      squad1.push(defenders[i]);
    } else {
      squad2.push(defenders[i]);
    }
  }

  // For every MF add one to squad1 and one to squad2
  for (let i = 0; i < midfielders.length; i++) {
    if (squad1.length === halfOfPlayers) {
      squad2.push(midfielders[i]);
    } else if (squad2.length === halfOfPlayers) {
      squad1.push(midfielders[i]);
    } else if (i % 2 === 0) {
      squad1.push(midfielders[i]);
    } else {
      squad2.push(midfielders[i]);
    }
  }

  // For every FW add one to squad1 and one to squad2
  for (let i = 0; i < forwards.length; i++) {
    if (squad1.length === halfOfPlayers) {
      squad2.push(forwards[i]);
    } else if (squad2.length === halfOfPlayers) {
      squad1.push(forwards[i]);
    } else if (i % 2 === 0) {
      squad1.push(forwards[i]);
    } else {
      squad2.push(forwards[i]);
    }
  }

  // Check if any squad had more than 1 playes more than second squad
  const squad1Length = squad1.length;
  const squad2Length = squad2.length;

  if (squad1Length - squad2Length > 1) {
    // Remove one player from squad1 and add to squad2
    const player = squad1.pop();
    if (player) {
      squad2.push(player);
    }
  } else if (squad2Length - squad1Length > 1) {
    // Remove one player from squad2 and add to squad1
    const player = squad2.pop();
    if (player) {
      squad1.push(player);
    }
  }

  return [squad1, squad2];
};

export const assignPlayerToMostRareRole = (
  defenders: Player[],
  midfielders: Player[],
  forwards: Player[]
) => {
  const defendersCount = defenders.length;
  const midfieldersCount = midfielders.length;
  const forwardsCount = forwards.length;

  if (defendersCount <= midfieldersCount && defendersCount <= forwardsCount) {
    return "DF";
  }

  if (midfieldersCount <= defendersCount && midfieldersCount <= forwardsCount) {
    return "MF";
  }

  if (forwardsCount <= defendersCount && forwardsCount <= midfieldersCount) {
    return "FW";
  }

  return "DF";
};
