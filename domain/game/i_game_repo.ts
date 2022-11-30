import { Game } from "./game";

export type IGameRepo = {
  getGames: () => Promise<Game[]>;
  getGame: (id: string) => Promise<Game>;
  createGame: (game: Game) => Promise<Game>;
  updateGame: (id: string, player: string) => Promise<string>;
  deleteGame: (id: string) => Promise<void>;
};
