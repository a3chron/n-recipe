import AsyncStorage from "@react-native-async-storage/async-storage";

const APPEARANCE_KEY = "@appearance_settings";

export interface AppearanceSettings {
  themeMode: "nothing" | "catppuccin" | "system";
  catppuccinAccent: string;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  themeMode: "catppuccin",
  catppuccinAccent: "mauve",
};

export class AppearanceService {
  static async getSettings(): Promise<AppearanceSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(APPEARANCE_KEY);
      if (settingsJson) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Error loading appearance settings:", error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(
    settings: Partial<AppearanceSettings>,
  ): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(APPEARANCE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      throw error;
    }
  }

  static async setAccentColor(color: string): Promise<void> {
    await this.saveSettings({
      catppuccinAccent: color,
      themeMode: "catppuccin",
    });
  }

  static async enableSystemAccent(): Promise<void> {
    await this.saveSettings({ themeMode: "system" });
  }
}
