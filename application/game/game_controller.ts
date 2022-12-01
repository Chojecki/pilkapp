import { Game, Player } from "../../domain/game/game";
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
  async getGames() {
    try {
      const games = await repo.getGames();
      return games;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async getGame(id: string) {
    try {
      const game = await repo.getGame(id);
      return game;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async updateGame(id: string, player: Player) {
    try {
      const gameres = await repo.updateGame(id, player);
      return gameres;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async deletePlayer(id: string, player: Player) {
    try {
      await repo.deletePlayer(id, player);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
