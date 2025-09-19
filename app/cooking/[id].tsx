import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAccentColors } from "@/hooks/use-system-accent";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChefHat } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function ServingSelectorScreen() {
  const { recipe } = useLocalSearchParams<{ recipe: string }>();
  const recipeData = JSON.parse(recipe || "{}");
  const [selectedServings, setSelectedServings] = useState(
    recipeData.servings || 1,
  );
  const accentColors = useAccentColors();
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView | null>(null);

  const itemHeight = 80;
  const visibleItems = 5;
  const scrollViewHeight = itemHeight * visibleItems;

  const servingOptions = Array.from({ length: 24 }, (_, i) => i + 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current && recipeData.servings) {
        const initialOffsetY = (recipeData.servings - 1) * itemHeight;
        scrollViewRef.current.scrollTo({ y: initialOffsetY, animated: false });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [recipeData.servings]);

  const handleContinue = () => {
    router.push({
      pathname: "/cooking/ingredients/[id]",
      params: {
        id: recipeData.id,
        servings: selectedServings.toString(),
        recipe: recipe,
      },
    });
  };

  const handleServingPress = (serving: number) => {
    const offsetY = (serving - 1) * itemHeight;
    scrollViewRef.current?.scrollTo({ y: offsetY, animated: true });
  };

  const renderServingItem = (serving: number) => {
    const isSelected = serving === selectedServings;
    return (
      <TouchableOpacity
        key={serving}
        onPress={() => handleServingPress(serving)}
        className="justify-center items-center mx-5 rounded-2xl"
        style={{
          height: itemHeight,
          backgroundColor: isSelected ? accentColors.primary : "transparent",
        }}
        activeOpacity={0.7}
      >
        <ThemedText
          style={{
            color: isSelected ? accentColors.crust : accentColors.text,
            fontSize: isSelected ? 32 : 24,
            fontWeight: isSelected ? "bold" : "normal",
            opacity: isSelected ? 1 : 0.5,
          }}
        >
          {serving}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView
      className="flex-1"
      style={{ backgroundColor: accentColors.base }}
    >
      {/* Header */}
      <ThemedView
        className="flex-row items-center px-6 pt-16 pb-4"
        style={{ backgroundColor: accentColors.base }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color={accentColors.subtext0} />
        </TouchableOpacity>
        <ThemedText
          type="title"
          style={{ color: accentColors.text, fontSize: 22, fontWeight: "bold" }}
          className="flex-1"
        >
          {t("cook.selectServings")}
        </ThemedText>
      </ThemedView>

      {/* Recipe Title */}
      <ThemedView
        className="px-6 pt-6"
        style={{ backgroundColor: accentColors.base }}
      >
        <ThemedText
          className="text-center text-lg font-medium"
          style={{ color: accentColors.subtext1 }}
        >
          {recipeData.title}
        </ThemedText>
      </ThemedView>

      {/* Serving Selector */}
      <ThemedView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: accentColors.base }}
      >
        <ThemedText
          className="text-center mb-8 text-lg"
          style={{ color: accentColors.text }}
        >
          {t("cook.howManyServings")}
        </ThemedText>

        <ThemedView
          className="relative w-full"
          style={{
            height: scrollViewHeight,
            backgroundColor: accentColors.base,
          }}
        >
          {/* Top fade */}
          <LinearGradient
            colors={[accentColors.base, accentColors.base + "00"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: itemHeight * 2,
              zIndex: 1,
            }}
            pointerEvents="none"
          />

          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingTop: itemHeight * 2,
              paddingBottom: itemHeight * 2,
            }}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              const index = Math.round(offsetY / itemHeight);
              const newServings = servingOptions[index];
              if (newServings && newServings !== selectedServings) {
                setSelectedServings(newServings);
              }
            }}
            scrollEventThrottle={16}
          >
            {servingOptions.map(renderServingItem)}
          </ScrollView>

          {/* Bottom fade */}
          <LinearGradient
            colors={[accentColors.base + "00", accentColors.base]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: itemHeight * 2,
              zIndex: 1,
            }}
            pointerEvents="none"
          />

          {/* Selection highlight */}
          <View
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: itemHeight * 2 - 6,
              height: itemHeight + 12,
              backgroundColor: accentColors.primary + "10",
              zIndex: 2,
            }}
          />
        </ThemedView>

        <ThemedText
          className="text-center mt-4 text-sm"
          style={{ color: accentColors.subtext0 }}
        >
          {t("cook.originalServings", { count: recipeData.servings })}
        </ThemedText>
      </ThemedView>

      {/* Continue Button */}
      <ThemedView
        className="p-6"
        style={{ backgroundColor: accentColors.base }}
      >
        <TouchableOpacity
          className="rounded-2xl py-4 items-center shadow-lg"
          style={{ backgroundColor: accentColors.primary }}
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          <ThemedView
            className="flex-row items-center gap-2"
            style={{ backgroundColor: "transparent" }}
          >
            <ChefHat size={20} color={accentColors.crust} />
            <ThemedText
              type="button"
              className="font-semibold text-lg"
              style={{ color: accentColors.crust }}
            >
              {t("cook.continue")}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
