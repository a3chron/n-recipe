import { Tabs } from "expo-router";
import React from "react";

import { useAccentColors } from "@/hooks/use-system-accent";
import { BookHeart, House, Settings } from "lucide-react-native";

export default function TabLayout() {
  const accentColors = useAccentColors();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: accentColors.primary,
        tabBarInactiveTintColor: accentColors.subtext0,
        headerShown: false,
        animation: "shift",
        tabBarStyle: {backgroundColor: accentColors.crust, paddingTop: 12},
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
