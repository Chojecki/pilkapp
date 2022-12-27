// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Game, Player } from "../domain/game/game";
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

const appCheckKey = process.env.APP_CHECK ?? "";

Object.assign(window, {
  FIREBASE_APPCHECK_DEBUG_TOKEN: process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKENć,
});

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(appCheckKey),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

export const gamesCoverter = {
  toFirestore: (data: Game) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Game,
};

export const playerCoverter = {
  toFirestore: (data: Player) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    return {
      ...snap.data(),
      id: snap.id,
    } as Player;
  },
};

export const gamesCollectionRef = collection(database, "games").withConverter(
  gamesCoverter
);
