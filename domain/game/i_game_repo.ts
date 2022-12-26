import { Game, Player } from "./game";

export type IGameRepo = {
  getGames: (userId?: string) => Promise<Game[]>;
  getGame: (id: string) => Promise<Game>;
  updateParticipant: (id: string, player: Player) => Promise<Player>;
  createGame: (game: Game) => Promise<Game>;
  updateGame: (id: string, player: Player) => Promise<Player>;
  deletePlayer: (id: string, player: Player) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  getParticipants: (id: string) => Promise<Player[]>;
};
