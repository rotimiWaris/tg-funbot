import { create } from "zustand";

// Define the User type
interface User {
  id: string;
  username: string;
  high_score: number;
}

// Define the store state and actions
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  isNewUser: boolean;
  setIsNewUser: (isNewUser: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isNewUser: true, // Initial value for isNewUser
  setIsNewUser: (isNewUser) => set({ isNewUser }), // Function to update the state
}));
