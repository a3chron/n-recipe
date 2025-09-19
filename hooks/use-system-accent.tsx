import { AppearanceService, AppearanceSettings } from "@/services/appearance";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

// For when Material3 theme is available
let useMaterial3Theme: any = null;
try {
  const material3Module = require("@pchmn/expo-material3-theme");
  useMaterial3Theme = material3Module.useMaterial3Theme;
} catch (error) {
  // Library not installed, will use fallback
  console.log("Material3 theme not available, using fallback colors");
}

export type ThemeMode = "system" | "catppuccin" | "nothing";

export interface AccentColors {
  primary: string;
  secondary: string;
  tertiary: string;
  surface: string;
  onSurface: string;
  base: string;
  mantle: string;
  crust: string;
  text: string;
  subtext0: string;
  subtext1: string;
}

interface ThemeContextType {
  colors: AccentColors;
  settings: AppearanceSettings;
  updateSettings: (settings: Partial<AppearanceSettings>) => Promise<void>;
  refreshTheme: () => Promise<void>;
}

// Catppuccin color palettes
const CATPPUCCIN_LATTE = {
  base: "#eff1f5",
  mantle: "#e6e9ef",
  crust: "#dce0e8",
  text: "#4c4f69",
  subtext0: "#6c6f85",
  subtext1: "#5c5f77",
  surface: "#ccd0da",
  onSurface: "#4c4f69",
  rosewater: "#dc8a78",
  flamingo: "#dd7878",
  pink: "#ea76cb",
  mauve: "#8839ef",
  red: "#d20f39",
  maroon: "#e64553",
  peach: "#fe640b",
  yellow: "#df8e1d",
  green: "#40a02b",
  teal: "#179299",
  sky: "#04a5e5",
  sapphire: "#209fb5",
  blue: "#1e66f5",
  lavender: "#7287fd",
};

const CATPPUCCIN_MOCHA = {
  base: "#1e1e2e",
  mantle: "#181825",
  crust: "#11111b",
  text: "#cdd6f4",
  subtext0: "#a6adc8",
  subtext1: "#bac2de",
  surface: "#313244",
  onSurface: "#cdd6f4",
  rosewater: "#f5e0dc",
  flamingo: "#f2cdcd",
  pink: "#f5c2e7",
  mauve: "#cba6f7",
  red: "#f38ba8",
  maroon: "#eba0ac",
  peach: "#fab387",
  yellow: "#f9e2af",
  green: "#a6e3a1",
  teal: "#94e2d5",
  sky: "#89dceb",
  sapphire: "#74c7ec",
  blue: "#89b4fa",
  lavender: "#b4befe",
};

export const CATPPUCCIN_ACCENT_OPTIONS = [
  { name: "Rosewater", value: "rosewater" },
  { name: "Flamingo", value: "flamingo" },
  { name: "Pink", value: "pink" },
  { name: "Mauve", value: "mauve" },
  { name: "Red", value: "red" },
  { name: "Maroon", value: "maroon" },
  { name: "Peach", value: "peach" },
  { name: "Yellow", value: "yellow" },
  { name: "Green", value: "green" },
  { name: "Teal", value: "teal" },
  { name: "Sky", value: "sky" },
  { name: "Sapphire", value: "sapphire" },
  { name: "Blue", value: "blue" },
  { name: "Lavender", value: "lavender" },
];

// Nothing theme colors
const NOTHING_LIGHT = {
  base: "#FFFFFF",
  mantle: "#F5F5F5",
  crust: "#E5E5E5",
  text: "#1C1C1C",
  subtext0: "#525252",
  subtext1: "#404040",
  surface: "#F9F9F9",
  onSurface: "#1C1C1C",
  primary: "#C8102E",
};

const NOTHING_DARK = {
  base: "#000000",
  mantle: "#0A0A0A",
  crust: "#141414",
  text: "#E5E5E5",
  subtext0: "#A3A3A3",
  subtext1: "#D4D4D4",
  surface: "#1C1C1C",
  onSurface: "#E5E5E5",
  primary: "#C8102E",
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function getCatppuccinColors(
  isDark: boolean,
  accentKey: string = "mauve",
): AccentColors {
  const palette = isDark ? CATPPUCCIN_MOCHA : CATPPUCCIN_LATTE;
  const accent = palette[accentKey as keyof typeof palette] || palette.mauve;

  return {
    primary: accent,
    secondary: palette.surface,
    tertiary: isDark ? palette.surface : palette.mantle,
    surface: palette.surface,
    onSurface: palette.text,
    base: palette.base,
    mantle: palette.mantle,
    crust: palette.crust,
    text: palette.text,
    subtext0: palette.subtext0,
    subtext1: palette.subtext1,
  };
}

function getNothingColors(isDark: boolean): AccentColors {
  const palette = isDark ? NOTHING_DARK : NOTHING_LIGHT;

  return {
    primary: palette.primary,
    secondary: adjustColorBrightness(palette.primary, isDark ? -20 : 20),
    tertiary: adjustColorBrightness(palette.primary, isDark ? -40 : 40),
    surface: palette.surface,
    onSurface: palette.onSurface,
    base: palette.base,
    mantle: palette.mantle,
    crust: palette.crust,
    text: palette.text,
    subtext0: palette.subtext0,
    subtext1: palette.subtext1,
  };
}

function generateSystemColors(
  materialColors: any,
  isDark: boolean,
): AccentColors {
  return {
    primary: materialColors.primary,
    secondary: materialColors.secondary,
    tertiary: materialColors.tertiary,
    surface: materialColors.surface,
    onSurface: materialColors.onSurface,
    base: isDark ? "#1C1C1C" : "#FFFFFF",
    mantle: isDark ? "#0F0F0F" : "#F5F5F5",
    crust: isDark ? "#141414" : "#E5E5E5",
    text: isDark ? "#E5E5E5" : "#1C1C1C",
    subtext0: isDark ? "#A3A3A3" : "#525252",
    subtext1: isDark ? "#D4D4D4" : "#404040",
  };
}

function adjustColorBrightness(color: string, amount: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<AppearanceSettings>({
    themeMode: "nothing" as ThemeMode,
    catppuccinAccent: "mauve",
  });
  const [colors, setColors] = useState<AccentColors>(
    getNothingColors(colorScheme === "dark"),
  );

  // Try to use Material3 theme if available
  const material3Result = useMaterial3Theme
    ? useMaterial3Theme({
        fallbackSourceColor: "#3B82F6",
      })
    : null;

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    updateColors();
  }, [settings, colorScheme]);

  const loadSettings = async () => {
    try {
      const currentSettings = await AppearanceService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error("Failed to load appearance settings:", error);
    }
  };

  const updateColors = () => {
    const isDark = colorScheme === "dark";

    switch (settings.themeMode) {
      case "system":
        if (material3Result) {
          const currentTheme = material3Result.theme[colorScheme ?? "light"];
          setColors(generateSystemColors(currentTheme, isDark));
        } else {
          // Fallback to Nothing theme if Material3 is not available
          setColors(getNothingColors(isDark));
        }
        break;
      case "catppuccin":
        setColors(getCatppuccinColors(isDark, settings.catppuccinAccent));
        break;
      case "nothing":
      default:
        setColors(getNothingColors(isDark));
        break;
    }
  };

  const updateSettings = async (newSettings: Partial<AppearanceSettings>) => {
    try {
      await AppearanceService.saveSettings(newSettings);
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      // Handle Material3 theme updates for system mode
      if (material3Result && updatedSettings.themeMode === "system") {
        if (material3Result.resetTheme) {
          material3Result.resetTheme();
        }
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    }
  };

  const refreshTheme = async () => {
    await loadSettings();
  };

  return (
    <ThemeContext.Provider
      value={{ colors, settings, updateSettings, refreshTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useSystemAccent(): AccentColors {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useSystemAccent must be used within ThemeProvider");
  }
  return context.colors;
}

export function useThemeSettings() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeSettings must be used within ThemeProvider");
  }
  return {
    settings: context.settings,
    updateSettings: context.updateSettings,
    refreshTheme: context.refreshTheme,
  };
}

// Hook for getting accent colors
export function useAccentColors() {
  const colors = useSystemAccent();

  return {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    surface: colors.surface,
    onSurface: colors.onSurface,
    base: colors.base,
    mantle: colors.mantle,
    crust: colors.crust,
    text: colors.text,
    subtext0: colors.subtext0,
    subtext1: colors.subtext1,
  };
}
