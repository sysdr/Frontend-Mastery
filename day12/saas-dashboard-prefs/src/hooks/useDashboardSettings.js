import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'dashboard_settings';

const defaultSettings = {
  theme: 'light', // 'light' or 'dark'
  layout: 'grid', // 'grid' or 'list'
  showWelcomeBanner: true,
  itemsPerPage: 10,
  analyticsConsent: true,
};

export function useDashboardSettings() {
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') { // Server-side rendering safety
      return defaultSettings;
    }
    try {
      const storedSettings = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error("Failed to parse stored settings, using defaults:", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') { // Server-side rendering safety
      return;
    }
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to local storage:", error);
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return [settings, updateSetting];
}
