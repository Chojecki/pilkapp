import { Game } from "./game";

export type IGameRepo = {
  getGames: () => Promise<Game[]>;
  getGame: (id: string) => Promise<Game>;
  createGame: (game: Game) => Promise<Game>;
  updateGame: (game: Game) => Promise<Game>;
  deleteGame: (id: string) => Promise<void>;
};
