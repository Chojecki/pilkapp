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

// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
//   baseURL: "https://api.together.xyz/v1",
// });
// export const suggestSquadsWithOpenAI = async (
//   input: AiPlayerInput[],
//   playersPerTeam: number
// ) => {
//   const inputAsString = JSON.stringify(input);
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: systemPrompt },
//       {
//         role: "user",
//         content: `${inputAsString} Each team should have ${playersPerTeam} players`,
//       },
//     ],
//     model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//     temperature: 0.1,
//     max_tokens: 2164,
//   });

//   const { choices } = chatCompletion;
//   const { message } = choices[0];
//   if (message && message.content) {
//     const messageContent = message.content;
//     console.log("messageContent", messageContent);
//     const parsedMessage = JSON.parse(messageContent);
//     console.log("parsedMessage", parsedMessage);
//     return parsedMessage;
//   } else {
//     console.log("error", message);
//   }
// };

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

const systemPrompt = `
You are a soccer and sport specialist.

You will get a list of players in format of:

type Player = {
    id: string;
    name: string;
    role: "GK" | "DF" | "MF" | "FW",
skill: "1" | "2" | "3" | "4" | "5",
shape: "1" | "2" | "3" | "4" | "5", 
}

Base on given list of players you will split player into two teams. You want team to be as equal as possible - this means have equal chance to win. In case of skill and shape "1" means worst and "5" best. The role is about the role on soccer field. GK - goalkeeper, DF -defence, MF - midfield, FW - attacker.

Not every team could have goalkeeper. But if there is at least two GK, each team needs to have one. If there is only one GK and only one team will have goalkeeper - In that situation the other team which doesn't have goalkeeper will take turns at the goalkeeper position every 5 minutes. It means they probably need more defenders. It also means that players in a team without goalkeeper will be running less that players in a team with goalkeeper - because goalkeeper don't run much and they are changing on this position. So the "shape" is important in this aspect too.

Reply in format of array of two teams like:
Player[][] - first team, second team where eatch array has the same length or one more player than the other team (in case of odd number of players in the list you got as an input)

If there is Even number of players in the list you got as an input then each team should have the same number of players. If there is odd number of players the list you got as an input, then one team should have one player more than the other team.

Remember - In one team from response can't be more that one more player than in the other team.

Make sure that response will phare to JSON format. So it needs to have [] and {} in the right places.

Example response: [[{"id":"1","name":"John","role":"GK","skill":"5","shape":"5"},{"id":"2","name":"Mike","role":"DF","skill":"4","shape":"3"}],[{"id":"3","name":"Tom","role":"GK","skill":"3","shape":"2"},{"id":"4","name":"Jerry","role":"DF","skill":"2","shape":"1"}]

Assistant, please respond ONLY in JSON format. I understand that this may seem repetitive, but it is crucial that your response contains NO additional text, explanations, or prompts, only the JSON response. Never ever add anything started from "Please note..." at the end of the response. If you do, the response will be invalid. Last character of the response should be "]".`;
