// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Game } from "../domain/game/game";
// import { ServerData } from "~/domain/server_data/server_data";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyABAYZtpwFs5QB7-kc4S9rRgi2ittRqQG0",
  authDomain: "pilkapp.firebaseapp.com",
  projectId: "pilkapp",
  storageBucket: "pilkapp.appspot.com",
  messagingSenderId: "461864708285",
  appId: "1:461864708285:web:854a0ba4efc2b2bebeefd4",
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
