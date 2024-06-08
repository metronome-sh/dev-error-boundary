import { useEffect, useMemo } from "react";
import { create } from "zustand";

const themeLocalStorageKey = "dev-error-boundary:theme";

type Theme = "dark" | "light";
type ThemePreference = Theme | "system";

interface ThemeState {
  userSelectedTheme: ThemePreference | undefined;
  setSelectedtUserTheme: (themePreference: ThemePreference) => void;
}

export const getSystemTheme = (): Theme | undefined => {
  if (typeof window === "undefined") return undefined;

  const media = "(prefers-color-scheme: dark)";
  const prefersDarkMode = window.matchMedia(media).matches;
  return prefersDarkMode ? "dark" : "light";
};

const getLocalStorageTheme = (): Theme | undefined => {
  if (typeof window === "undefined") return undefined;

  const savedTheme = localStorage.getItem(
    themeLocalStorageKey
  ) as ThemePreference | null;

  if (savedTheme === "system" || savedTheme === null) return getSystemTheme();

  return savedTheme;
};

const setLocalStorageTheme = (theme: ThemePreference) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(themeLocalStorageKey, theme);
};

const useThemeStore = create<ThemeState>((set) => ({
  userSelectedTheme: undefined,
  setSelectedtUserTheme: (themePreference: ThemePreference) => {
    set({ userSelectedTheme: themePreference });
  },
}));

export function useTheme() {
  const { userSelectedTheme, setSelectedtUserTheme } = useThemeStore();

  // Initialized the theme based on the user's preference
  useEffect(() => {
    if (!userSelectedTheme)
      setSelectedtUserTheme(getLocalStorageTheme() ?? "system");
  }, []);

  const theme = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    return userSelectedTheme === "system" || !userSelectedTheme
      ? getSystemTheme()
      : userSelectedTheme;
  }, [userSelectedTheme]);

  const rotateTheme = () => {
    if (!userSelectedTheme) {
      setSelectedtUserTheme("system");
      return;
    }

    const rotation = ["system", "light", "dark"] as const;
    const nextIndex =
      (rotation.indexOf(userSelectedTheme as any) + 1) % rotation.length;
    setSelectedtUserTheme(rotation[nextIndex]);

    setLocalStorageTheme(rotation[nextIndex]);
  };

  return { userSelectedTheme, setSelectedtUserTheme, rotateTheme, theme };
}
