import { create } from "zustand";

export const useUserStore = create((set) => ({
  // Initial state
  user: null, // The current user object
  isNewUser: false, // Flag indicating if the user is new

  // Actions to update the state
  setUser: (user) => set({ user }), // Update the user state
  setIsNewUser: (isNew) => set({ isNewUser: isNew }), // Update the isNewUser flag
}));
