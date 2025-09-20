import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import RecipeType from "@/components/ui/category";
import RecipeCard from "@/components/ui/recipe-card";
import { useAccentColors } from "@/hooks/use-system-accent";
import { StorageService } from "@/services/storage";
import { RecipeType as Recipe_Type, RecipeCategoryType } from "@/types/recipe";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import {
  CakeSlice,
  CookingPot,
  Croissant,
  EggFried,
  Pizza,
  Plus,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, TouchableOpacity } from "react-native";

type RecipeTypeItem = {
  name: string;
  internal: RecipeCategoryType;
  icon: React.ReactNode;
};

export default function HomeScreen() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe_Type[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const accentColors = useAccentColors();
  const { t } = useTranslation();

  const recipeTypes: RecipeTypeItem[] = [
    {
      name: t("global.breakfast"),
      internal: "breakfast",
      icon: <EggFried size={44} color={accentColors.primary} />,
    },
    {
      name: t("global.lunch"),
      internal: "lunch",
      icon: <CookingPot size={44} color={accentColors.primary} />,
    },
    {
      name: t("global.dinner"),
      internal: "dinner",
      icon: <Pizza size={44} color={accentColors.primary} />,
    },
    {
      name: t("global.snack"),
      internal: "snack",
      icon: <Croissant size={44} color={accentColors.primary} />,
    },
    {
      name: t("global.dessert"),
      internal: "dessert",
      icon: <CakeSlice size={44} color={accentColors.primary} />,
    },
  ];

  const loadFavorites = async () => {
    setIsLoading(true);
    const recipes = await StorageService.getFavoriteRecipes();
    setFavoriteRecipes(recipes);
    setIsLoading(false);
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1 p-6 pt-16"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 76 }}
      >
        <ThemedText type="title" className="mb-2">
          {t("home.types")}
        </ThemedText>
        <ThemedText className="mb-6 opacity-70">
          {t("home.selectType")}
        </ThemedText>
        <ThemedView className="flex flex-row flex-wrap items-center justify-center gap-4 mb-8 bg-transparent">
          {recipeTypes.map((type) => (
            <RecipeType
              key={type.name}
              category={type.internal}
              name={type.name}
              icon={type.icon}
            />
          ))}
        </ThemedView>
        <ThemedText type="title" className="mb-2">
          {t("home.favorites")}
        </ThemedText>
        <ThemedText className="mb-6 opacity-70">
          {t("home.favoriteRecipes")}
        </ThemedText>
        <ThemedView className="flex flex-col gap-4 bg-transparent">
          {favoriteRecipes.length > 0 ? (
            favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            <ThemedText className="text-center opacity-50 py-8">
              {isLoading ? t("home.loadingFavRecipes") : t("home.noFavRecipes")}
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: accentColors.crust }}
        onPress={() => router.push("/add-recipe")}
        activeOpacity={0.8}
      >
        <Plus size={28} color={accentColors.text} />
      </TouchableOpacity>
    </ThemedView>
  );
}
