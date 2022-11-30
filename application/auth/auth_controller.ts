import { AppUser } from "../../domain/auth/auth";
import { IAuthFacade } from "../../domain/auth/i_auth_facade";
import { firebaseRepository } from "../../infrastructure/auth/auth_facade";

const repo: IAuthFacade = firebaseRepository;

export const authController = {
  async register(email: string, password: string) {
    try {
      const user = await repo.register(email, password);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const user = await repo.login(email, password);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getCurrentUser() {
    const user = await repo.getCurrentUser();
    return user;
  },

  onAuthStateChanged(callback: (user: AppUser | null) => void) {
    try {
      return repo.onAuthStateChanged(callback);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async logout() {
    try {
      await repo.logout();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
