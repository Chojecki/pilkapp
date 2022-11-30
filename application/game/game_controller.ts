import { Game } from "../../domain/game/game";
import { IGameRepo } from "../../domain/game/i_game_repo";
import { firebaseGameRepo } from "../../infrastructure/game/game_repo";

const repo: IGameRepo = firebaseGameRepo;

export const gameController = {
  async createGame(game: Game) {
    try {
      const gameres = await repo.createGame(game);
      return gameres;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
