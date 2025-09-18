import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";

import { useAccentClasses } from "@/hooks/use-system-accent";
import { BookHeart, House, Settings } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const accentColors = useAccentClasses();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: accentColors.primary,
        headerShown: false,
        animation: "shift",
        tabBarStyle: {...styles.tabBar, backgroundColor: colorScheme === "light" ? "white" : "black"},
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="recipes"
        options={{
          tabBarIcon: ({ color }) => <BookHeart color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    color: "black",
    backgroundColor: "red",
  },
  tabBar: {
    paddingTop: 16,
    height: 84,
  },
});
