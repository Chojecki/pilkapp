import { Game, Player } from "../domain/game/game";

export interface AiPlayerInput {
  id: string;
  name: string;
  role: "GK" | "DF" | "MF" | "FW";
  skill: "1" | "2" | "3" | "4" | "5";
  shape: "1" | "2" | "3" | "4" | "5";
}

export const splitPlayers = (players: Player[], game: Game) => {
  // First game.numberOfPlayers players
  const mainSquad = players?.slice(0, game?.numberOfPlayers ?? 14) ?? [];

  // Players on the bench
  const bench = players?.slice(game?.numberOfPlayers ?? 14) ?? [];

  return { mainSquad, bench };
};

// ... (OpenAI code commented out) ...

export function splitTeams(players: Player[]): Player[][] {
  // Calculate player strength based on skill and shape
  const getPlayerStrength = (player: Player): number => {
    const skillNum = player.skill ? parseInt(player.skill) : 3;
    const shapeNum = player.shape ? parseInt(player.shape) : 3;
    // Give slightly more weight to skill than shape
    return skillNum * 1.2 + shapeNum;
  };

  // Sort players by role and strength
  const sortedPlayers = [...players].sort((a, b) => {
    const roleOrder: { [key: string]: number } = { GK: 0, DF: 1, MF: 2, FW: 3 };
    if (a.role !== b.role) return roleOrder[a.role] - roleOrder[b.role];
    return getPlayerStrength(b) - getPlayerStrength(a);
  });

  const team1: Player[] = [];
  const team2: Player[] = [];
  let team1Strength = 0;
  let team2Strength = 0;

  // First, distribute goalkeepers evenly
  const goalkeepers = sortedPlayers.filter((p) => p.role === "GK");
  const outfieldPlayers = sortedPlayers.filter((p) => p.role !== "GK");

  if (goalkeepers.length >= 2) {
    team1.push(goalkeepers[0]);
    team2.push(goalkeepers[1]);
    team1Strength += getPlayerStrength(goalkeepers[0]);
    team2Strength += getPlayerStrength(goalkeepers[1]);

    // Add remaining GKs alternately if any
    for (let i = 2; i < goalkeepers.length; i++) {
      if (team1Strength <= team2Strength) {
        team1.push(goalkeepers[i]);
        team1Strength += getPlayerStrength(goalkeepers[i]);
      } else {
        team2.push(goalkeepers[i]);
        team2Strength += getPlayerStrength(goalkeepers[i]);
      }
    }
  } else if (goalkeepers.length === 1) {
    // If only one GK, give to the team that will have more defenders
    const defenders = outfieldPlayers.filter((p) => p.role === "DF");
    if (defenders.length % 2 === 0) {
      team1.push(goalkeepers[0]);
      team1Strength += getPlayerStrength(goalkeepers[0]);
    } else {
      team2.push(goalkeepers[0]);
      team2Strength += getPlayerStrength(goalkeepers[0]);
    }
  }

  // Group outfield players by role
  const defenders = outfieldPlayers.filter((p) => p.role === "DF");
  const midfielders = outfieldPlayers.filter((p) => p.role === "MF");
  const forwards = outfieldPlayers.filter((p) => p.role === "FW");

  // Helper function to distribute players of a role
  const distributePlayersByRole = (players: Player[]) => {
    for (const player of players) {
      if (team1.length > team2.length) {
        team2.push(player);
        team2Strength += getPlayerStrength(player);
      } else if (team2.length > team1.length) {
        team1.push(player);
        team1Strength += getPlayerStrength(player);
      } else {
        // Teams have equal size, distribute based on total strength
        if (team1Strength <= team2Strength) {
          team1.push(player);
          team1Strength += getPlayerStrength(player);
        } else {
          team2.push(player);
          team2Strength += getPlayerStrength(player);
        }
      }
    }
  };

  // Distribute players by role, maintaining balance
  distributePlayersByRole(defenders);
  distributePlayersByRole(midfielders);
  distributePlayersByRole(forwards);

  return [team1, team2];
}

export const suggestSquads = (mainSquad: Player[], game?: Game): Player[][] => {
  let squad1: Player[] = [];
  let squad2: Player[] = [];
  let remainingPlayers = [...mainSquad]; // Clone to modify

  const organizerPlayer = mainSquad.find(p => p.userId === game?.creator);
  const fixedTeammate = mainSquad.find(p => p.isFixedTeammate === true);

  if (organizerPlayer && fixedTeammate && organizerPlayer.id !== fixedTeammate.id) {
    squad1.push(organizerPlayer);
    squad1.push(fixedTeammate);
    remainingPlayers = mainSquad.filter(
      p => p.id !== organizerPlayer.id && p.id !== fixedTeammate.id
    );
  } else {
    // If no pair, or organizer is the fixed teammate (which shouldn't happen with UI rules)
    // or one of them is not found, proceed with all players in remainingPlayers.
    // The UI should prevent organizer from selecting themselves.
  }

  const totalPlayersInGame = game?.numberOfPlayers ?? mainSquad.length; // Use initial mainSquad.length if game.numberOfPlayers is undefined
  let squad1TargetSize = Math.floor(totalPlayersInGame / 2);
  let squad2TargetSize = Math.floor(totalPlayersInGame / 2);

  if (totalPlayersInGame % 2 !== 0) {
    // If odd number of players, one team gets an extra player.
    // If squad1 has the pair, it's more likely to be the larger team.
    if (squad1.length > 0) { // True if pair was added
      squad1TargetSize = Math.ceil(totalPlayersInGame / 2);
    } else {
      // Could assign to squad1 or squad2, let's default to squad1 for now,
      // the balancing loop should handle it.
      squad1TargetSize = Math.ceil(totalPlayersInGame / 2);
    }
  }
  
  // Separate players by role from the REMAINING players
  const goalkeepers = remainingPlayers.filter((player) => player.role === "GK");
  const defenders = remainingPlayers.filter((player) => player.role === "DF");
  const midfielders = remainingPlayers.filter((player) => player.role === "MF");
  const forwards = remainingPlayers.filter((player) => player.role === "FW");

  // Distribute players by role
  const distributeByRole = (rolePlayers: Player[]) => {
    for (const player of rolePlayers) {
      // Check if squad1 needs more players and is smaller or equal to squad2 (or if squad2 is full)
      if (squad1.length < squad1TargetSize && (squad1.length <= squad2.length || squad2.length >= squad2TargetSize)) {
        squad1.push(player);
      } else if (squad2.length < squad2TargetSize) {
        squad2.push(player);
      } else {
        // This case should ideally not be reached if target sizes are correct
        // As a fallback, add to the smaller team if one is not yet full
        if (squad1.length < squad1TargetSize) squad1.push(player);
        else if (squad2.length < squad2TargetSize) squad2.push(player);
        // If both are "full" according to initial targets but players remain (e.g. due to pair), this needs care.
        // However, the primary distribution should be guided by squadXTargetSize.
      }
    }
  };

  distributeByRole(goalkeepers);
  distributeByRole(defenders);
  distributeByRole(midfielders);
  distributeByRole(forwards);
  
  // Final balancing to ensure no team has >1 player more than the other.
  // This is especially important if the initial role-based distribution isn't perfect.
  // Or if the fixed pair assignment caused an imbalance that the role distribution couldn't fully resolve.
  
  // Collect all players not yet assigned if any (e.g. if a role group was skipped or targets were met early)
  // This shouldn't happen if logic is correct, but as a safeguard:
  const allAssignedIds = new Set([...squad1.map(p=>p.id), ...squad2.map(p=>p.id)]);
  const trulyRemainingPlayers = remainingPlayers.filter(p => !allAssignedIds.has(p.id));

  for (const player of trulyRemainingPlayers) {
      if (squad1.length < squad1TargetSize && (squad1.length <= squad2.length || squad2.length >= squad2TargetSize)) {
        squad1.push(player);
      } else if (squad2.length < squad2TargetSize) {
        squad2.push(player);
      } else { // Fallback: add to strictly smaller team, or squad1 if equal
          if(squad1.length <= squad2.length) squad1.push(player);
          else squad2.push(player);
      }
  }


  // The existing final adjustment loop for team sizes.
  // This is a good safeguard.
  while (squad1.length - squad2.length > 1) {
    const playerToMove = squad1.pop();
    if (playerToMove) squad2.push(playerToMove);
    else break; // Should not happen
  }
  while (squad2.length - squad1.length > 1) {
    const playerToMove = squad2.pop();
    if (playerToMove) squad1.push(playerToMove);
    else break; // Should not happen
  }

  return [squad1, squad2];
};

// ... (assignPlayerToMostRareRole and systemPrompt) ...
// Assuming assignPlayerToMostRareRole and systemPrompt are not in the original file as they were not provided in the "Existing Code" block.
// If they were, they would need to be added here.
