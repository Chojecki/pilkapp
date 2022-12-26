import {
  arrayRemove,
  arrayUnion,
  collection,
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
import {
  database,
  gamesCollectionRef,
  playerCoverter,
} from "../../utils/firebaseConfig";

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
      const current = await this.getParticipants(id);
      // Check if the player is already in the game
      const playerInGame = current.find((p) => p.name === player.name);

      // If the player is not in the game, add him
      if (!playerInGame) {
        await setDoc(
          doc(collection(database, "games", id, "participants"), player.id),
          {
            ...player,
          }
        );
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
  updateParticipant: async function (
    id: string,
    player: Player
  ): Promise<Player> {
    try {
      // Get a game
      const game = await this.getGame(id);

      // Get all participants
      const participants = game.participants;
      // Get the index of the player
      const index = participants.findIndex((p) => p.id === player.id);
      // Update the player
      participants[index] = player;
      // Update the game
      await updateDoc(doc(gamesCollectionRef, id), {
        participants: participants,
      });
      return player;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getParticipants: async function (id: string): Promise<Player[]> {
    const docRef = collection(
      database,
      "games",
      id,
      "participants"
    ).withConverter(playerCoverter);
    const docSnap = await getDocs(docRef);
    const docsData = docSnap.docs.map((doc) => doc.data());

    return docsData;
  },
};
