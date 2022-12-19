import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AppUser } from "../../domain/auth/auth";
import { IAuthFacade } from "../../domain/auth/i_auth_facade";
import { auth } from "../../utils/firebaseConfig";

export const firebaseAuthRepository: IAuthFacade = {
  async register(email: string, password: string) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredentials.user;
      const appUser: AppUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? "",
      };
      return appUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredentials.user;
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? "",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCurrentUser: function (): Promise<AppUser | null> {
    try {
      const aauth = getAuth();
      const user = aauth.currentUser;

      if (user) {
        return Promise.resolve({
          id: user.uid,
          email: user.email ?? "",
        });
      }
      return Promise.resolve(null);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      signOut(auth);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
