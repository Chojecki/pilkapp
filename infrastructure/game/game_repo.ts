import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Game } from "../../domain/game/game";
import { IGameRepo } from "../../domain/game/i_game_repo";
import { gamesCollectionRef } from "../../utils/firebaseConfig";

export const firebaseGameRepo: IGameRepo = {
  getGames: function (): Promise<Game[]> {
    throw new Error("Function not implemented.");
  },
  getGame: async function (id: string): Promise<Game> {
    const docRef = doc(gamesCollectionRef, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Game;
    } else {
      throw new Error("No such document!");
    }
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
  updateGame: async function (id: string, player: string): Promise<string> {
    try {
      await updateDoc(doc(gamesCollectionRef, id), {
        participants: arrayUnion(player),
      });
      return player;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteGame: function (id: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
};
