import { create } from 'zustand';

const initialState = {
    userName: null,
    userEmail: null,
    isLoggedIn: false,
};

export const useUserProfileStore = create((set) => ({
    ...initialState,
    login: (name, email) => set({ userName: name, userEmail: email, isLoggedIn: true }),
    logout: () => set({ userName: null, userEmail: null, isLoggedIn: false }),
    reset: () => set(initialState),
}));
