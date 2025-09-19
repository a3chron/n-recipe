import { ThemeProvider } from "@/hooks/use-system-accent";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nextProvider } from "react-i18next";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import "../i18n";
import i18n from "../i18n";
import "../styles/global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <NavigationThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <I18nextProvider i18n={i18n}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="add-recipe"
              options={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="appearance-settings"
              options={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="recipe/[id]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="cooking/[id]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="cooking/ingredients/[id]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="cooking/step/[id]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </I18nextProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
