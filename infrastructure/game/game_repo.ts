import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Game, Player } from "../../domain/game/game";
import { IGameRepo } from "../../domain/game/i_game_repo";
import { gamesCollectionRef } from "../../utils/firebaseConfig";

export const firebaseGameRepo: IGameRepo = {
  getGames: async function (userId?: string): Promise<Game[]> {
    try {
      const queryDoc = await query(
        gamesCollectionRef,
        orderBy("date", "desc"),
        where("creator", "==", userId ?? "")
      );
      const querySnap = await getDocs(queryDoc);
      const docsData = querySnap.docs.map((doc) => doc.data());

      return docsData;
    } catch (error) {
      throw error;
    }
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
  updateGame: async function (id: string, player: Player): Promise<Player> {
    try {
      // Get a game
      const game = await this.getGame(id);
      // Check if the player is already in the game
      const playerInGame = game.participants.find(
        (p) => p.name === player.name
      );

      // If the player is not in the game, add him
      if (!playerInGame) {
        await updateDoc(doc(gamesCollectionRef, id), {
          participants: arrayUnion(player),
        });
        return player;
      }

      // If the player is in the game, return the player
      return playerInGame;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deletePlayer: async function (id: string, player: Player): Promise<void> {
    try {
      await updateDoc(doc(gamesCollectionRef, id), {
        participants: arrayRemove(player),
        removedPlayers: arrayUnion(player),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteGame: function (id: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
};
