import { doc, setDoc } from "firebase/firestore";
import { Game } from "../../domain/game/game";
import { IGameRepo } from "../../domain/game/i_game_repo";
import { gamesCollectionRef } from "../../utils/firebaseConfig";

export const firebaseGameRepo: IGameRepo = {
  getGames: function (): Promise<Game[]> {
    throw new Error("Function not implemented.");
  },
  getGame: function (id: string): Promise<Game> {
    throw new Error("Function not implemented.");
  },
  createGame: async function (game: Game): Promise<Game> {
    try {
      await setDoc(doc(gamesCollectionRef, game.id), { ...game, price: 120 });
      return game;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateGame: function (game: Game): Promise<Game> {
    throw new Error("Function not implemented.");
  },
  deleteGame: function (id: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
};
