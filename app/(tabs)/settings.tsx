import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAccentClasses } from "@/hooks/use-system-accent";
import { router } from "expo-router";
import { ChevronRight, Github, Palette, Scale } from "lucide-react-native";
import { Linking, ScrollView, TouchableOpacity, useColorScheme } from "react-native";

const APP_VERSION = "1.0.0";
const GITHUB_URL = "https://github.com/a3chron/n-recipe";

export default function SettingsScreen() {
  const accentClasses = useAccentClasses();
  const colorScheme = useColorScheme()

  const openGithub = () => {
    Linking.openURL(GITHUB_URL);
  };

  const openLicence = () => {
    Linking.openURL(GITHUB_URL + "/blob/main/LICENSE");
  };

  const openAppearanceSettings = () => {
    router.push('/appearance-settings');
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 p-6 pt-16">
        <ThemedText type="title" className="mb-8">
          Settings
        </ThemedText>

        {/* Appearance Section */}
        <ThemedView className="mb-8 bg-transparent">
          <ThemedText type="subtitle" className="mb-4">
            Customization
          </ThemedText>
          
          <TouchableOpacity 
            onPress={openAppearanceSettings}
            className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4 flex-row items-center gap-4"
            activeOpacity={0.7}
          >
            <Palette size={24} color={colorScheme === "light" ? "#525252" : "#a3a3a3"} />
            <ThemedView className="flex-1 bg-transparent">
              <ThemedText type="defaultSemiBold" className="mb-1">
                Appearance
              </ThemedText>
              <ThemedText className="opacity-70 text-sm">
                Customize accent colors and theme
              </ThemedText>
            </ThemedView>
            <ChevronRight size={20} color="#a3a3a3" />
          </TouchableOpacity>
        </ThemedView>

        {/* App Information Section */}
        <ThemedView className="mb-8 bg-transparent">
          <ThemedText type="subtitle" className="mb-4">
            App Information
          </ThemedText>
          
          <ThemedView className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4 bg-transparent">
            <ThemedText className="opacity-70 mb-1">Version</ThemedText>
            <ThemedText type="defaultSemiBold">{APP_VERSION}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Links Section */}
        <ThemedView className="mb-8 bg-transparent">
          <ThemedText type="subtitle" className="mb-4">
            Links & Legal
          </ThemedText>
          
          {/* GitHub Repository */}
          <TouchableOpacity 
            onPress={openGithub}
            className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4 flex-row items-center gap-4"
            activeOpacity={0.7}
          >
            <Github size={24} color={colorScheme === "light" ? "#525252" : "#a3a3a3"} />
            <ThemedView className="flex-1 bg-transparent">
              <ThemedText type="defaultSemiBold" className="mb-1">
                GitHub Repository
              </ThemedText>
              <ThemedText className="opacity-70 text-sm">
                View source code and contribute
              </ThemedText>
            </ThemedView>
            <ChevronRight size={20} color="#a3a3a3" />
          </TouchableOpacity>

          {/* License */}
          <TouchableOpacity 
            onPress={openLicence}
            className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 flex-row items-center gap-4"
            activeOpacity={0.7}
          >
            <Scale size={24} color={colorScheme === "light" ? "#525252" : "#a3a3a3"} />
            <ThemedView className="flex-1 bg-transparent">
              <ThemedText type="defaultSemiBold" className="mb-1">
                License
              </ThemedText>
              <ThemedText className="opacity-70 text-sm">
                View license information
              </ThemedText>
            </ThemedView>
            <ChevronRight size={20} color="#a3a3a3" />
          </TouchableOpacity>
        </ThemedView>

        {/* About Section */}
        <ThemedView className="mb-8 bg-transparent">
          <ThemedText type="subtitle" className="mb-4">
            About
          </ThemedText>
          
          <ThemedText className="opacity-70 leading-6">
            N-Recipe is an offline recipe management app designed for Android. 
            Store and organize your favorite recipes locally on your device with 
            support for system accent colors and dark mode.
          </ThemedText>
        </ThemedView>

        {/* Footer */}
        <ThemedView className="items-center pt-8 pb-4 bg-transparent">
          <ThemedText className="opacity-40 text-sm text-center">
            Made with ❤️ for cooking enthusiasts
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}