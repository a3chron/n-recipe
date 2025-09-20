import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAccentColors } from "@/hooks/use-system-accent";
import { getFullVersionInfo } from "@/lib/version";
import { router } from "expo-router";
import {
  ChevronRight,
  Github,
  Languages,
  Palette,
  Scale,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, ScrollView, TouchableOpacity } from "react-native";

const GITHUB_URL = "https://github.com/a3chron/n-recipe";
const CROWNDIN_URL = "https://crowdin.com/project/n-recipe";

export default function SettingsScreen() {
  const accentColors = useAccentColors();
  const versionInfo = getFullVersionInfo();
  const { t } = useTranslation();

  const openGithub = () => {
    Linking.openURL(GITHUB_URL);
  };

  const openLicence = () => {
    Linking.openURL(GITHUB_URL + "/blob/main/LICENSE");
  };

  const openCrowdin = () => {
    Linking.openURL(CROWNDIN_URL);
  };

  const openAppearanceSettings = () => {
    router.push("/appearance-settings");
  };

  return (
    <ThemedView
      className="flex-1"
      style={{ backgroundColor: accentColors.base }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <ThemedView
          className="px-6 pt-16 pb-8"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText type="title" style={{ color: accentColors.text }}>
            {t("settings")}
          </ThemedText>
        </ThemedView>

        {/* Customization Section */}
        <ThemedView
          className="mx-6 mb-8"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText
            type="subtitle"
            className="mb-4"
            style={{ color: accentColors.text }}
          >
            Customization
          </ThemedText>

          <TouchableOpacity
            onPress={openAppearanceSettings}
            className="rounded-xl p-4 flex-row items-center gap-4"
            style={{ backgroundColor: accentColors.surface }}
            activeOpacity={0.7}
          >
            <Palette size={24} color={accentColors.primary} />
            <ThemedView
              className="flex-1"
              style={{ backgroundColor: accentColors.surface }}
            >
              <ThemedText
                type="bold"
                className="mb-1"
                style={{ color: accentColors.text }}
              >
                Appearance
              </ThemedText>
              <ThemedText
                className="text-sm"
                style={{ color: accentColors.subtext0 }}
              >
                Customize accent colors and theme
              </ThemedText>
            </ThemedView>
            <ChevronRight size={20} color={accentColors.subtext0} />
          </TouchableOpacity>
        </ThemedView>

        {/* App Information Section */}
        <ThemedView
          className="mx-6 mb-8"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText
            type="subtitle"
            className="mb-4"
            style={{ color: accentColors.text }}
          >
            App Information
          </ThemedText>

          <ThemedView
            className="rounded-xl p-4"
            style={{ backgroundColor: accentColors.surface }}
          >
            <ThemedText
              className="mb-1"
              style={{ color: accentColors.subtext0 }}
            >
              Version
            </ThemedText>
            <ThemedText type="bold" style={{ color: accentColors.text }}>
              {versionInfo.formatted}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Links & Legal Section */}
        <ThemedView
          className="mx-6 mb-8"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText
            type="subtitle"
            className="mb-4"
            style={{ color: accentColors.text }}
          >
            Links & Legal
          </ThemedText>

          {/* GitHub Repository */}
          <TouchableOpacity
            onPress={openGithub}
            className="rounded-xl p-4 mb-4 flex-row items-center gap-4"
            style={{ backgroundColor: accentColors.surface }}
            activeOpacity={0.7}
          >
            <Github size={24} color={accentColors.subtext1} />
            <ThemedView
              className="flex-1"
              style={{ backgroundColor: accentColors.surface }}
            >
              <ThemedText
                type="bold"
                className="mb-1"
                style={{ color: accentColors.text }}
              >
                GitHub Repository
              </ThemedText>
              <ThemedText
                className="text-sm"
                style={{ color: accentColors.subtext0 }}
              >
                View source code and contribute
              </ThemedText>
            </ThemedView>
            <ChevronRight size={20} color={accentColors.subtext0} />
          </TouchableOpacity>

          {/* Crowdin Translations */}
          <TouchableOpacity
            onPress={openCrowdin}
            className="rounded-xl p-4 mb-4 flex-row items-center gap-4"
            style={{ backgroundColor: accentColors.surface }}
            activeOpacity={0.7}
          >
            <Languages size={24} color={accentColors.subtext1} />
            <ThemedView
              className="flex-1"
              style={{ backgroundColor: accentColors.surface }}
            >
              <ThemedText
                type="bold"
                className="mb-1"
                style={{ color: accentColors.text }}
              >
                Crowdin Translations
              </ThemedText>
              <ThemedText
                className="text-sm"
                style={{ color: accentColors.subtext0 }}
              >
                Help translate this app to your language
              </ThemedText>
            </ThemedView>
            <ChevronRight size={20} color={accentColors.subtext0} />
          </TouchableOpacity>

          {/* License */}
          <TouchableOpacity
            onPress={openLicence}
            className="rounded-xl p-4 flex-row items-center gap-4"
            style={{ backgroundColor: accentColors.surface }}
            activeOpacity={0.7}
          >
            <Scale size={24} color={accentColors.subtext1} />
            <ThemedView
              className="flex-1"
              style={{ backgroundColor: accentColors.surface }}
            >
              <ThemedText
                type="bold"
                className="mb-1"
                style={{ color: accentColors.text }}
              >
                License
              </ThemedText>
              <ThemedText
                className="text-sm"
                style={{ color: accentColors.subtext0 }}
              >
                View license information
              </ThemedText>
            </ThemedView>
            <ChevronRight size={20} color={accentColors.subtext0} />
          </TouchableOpacity>
        </ThemedView>

        {/* About Section */}
        <ThemedView
          className="mx-6 mb-8"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText
            type="subtitle"
            className="mb-4"
            style={{ color: accentColors.text }}
          >
            About
          </ThemedText>

          <ThemedView
            className="rounded-xl p-4"
            style={{ backgroundColor: accentColors.surface }}
          >
            <ThemedText
              className="leading-6"
              style={{ color: accentColors.subtext1 }}
            >
              N-Recipe is an offline recipe management app designed for Android.
              Store and organize your favorite recipes locally on your device
              with support for system accent colors and dark mode.
            </ThemedText>
            <ThemedText
              className="leading-6 pt-2"
              style={{ color: accentColors.subtext1 }}
            >
              If you want to find more catppuccin style apps, check out my
              github.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Footer */}
        <ThemedView
          className="items-center pt-4"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText
            className="text-sm text-center"
            style={{ color: accentColors.subtext0 }}
          >
            Made with ❤️ for cooking enthusiasts
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
