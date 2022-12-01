import { Game, Player } from "./game";

export type IGameRepo = {
  getGames: () => Promise<Game[]>;
  getGame: (id: string) => Promise<Game>;
  createGame: (game: Game) => Promise<Game>;
  updateGame: (id: string, player: Player) => Promise<Player>;
  deletePlayer: (id: string, player: Player) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
};
