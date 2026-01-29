import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  themeTogglesCount: number;
  notificationTogglesCount: number;
  totalActions: number;
  toggleTheme: () => void;
  toggleNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  notificationsEnabled: true,
  themeTogglesCount: 0,
  notificationTogglesCount: 0,
  totalActions: 0,
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
    themeTogglesCount: state.themeTogglesCount + 1,
    totalActions: state.totalActions + 1,
  })),
  toggleNotifications: () => set((state) => ({
    notificationsEnabled: !state.notificationsEnabled,
    notificationTogglesCount: state.notificationTogglesCount + 1,
    totalActions: state.totalActions + 1,
  })),
}));
