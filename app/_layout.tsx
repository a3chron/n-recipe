import { ThemeProvider } from "@/hooks/use-system-accent";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import "../styles/global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-recipe"
            options={{ 
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom"
            }}
          />
          <Stack.Screen
            name="appearance-settings"
            options={{ 
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_right"
            }}
          />
          <Stack.Screen
            name="recipe/[id]"
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
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}