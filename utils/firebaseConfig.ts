// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import {
  QueryDocumentSnapshot,
  collection,
  getFirestore,
} from "firebase/firestore";
import { Game } from "../domain/game/game";
// import { ServerData } from "~/domain/server_data/server_data";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth();

export const gamesCoverter = {
  toFirestore: (data: Game) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Game,
};

export const gamesCollectionRef = collection(database, "games").withConverter(
  gamesCoverter
);
