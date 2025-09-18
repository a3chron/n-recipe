import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import RecipeCard from "@/components/ui/recipe-card";
import RecipeType from "@/components/ui/type";
import { useAccentClasses } from "@/hooks/use-system-accent";
import { StorageService } from "@/services/storage";
import { RecipeType as Recipe_Type } from "@/types/recipe";
import { router } from "expo-router";
import {
  CakeSlice,
  CookingPot,
  Croissant,
  EggFried,
  Pizza,
  Plus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe_Type[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const accentClasses = useAccentClasses();

  const recipeTypes = [
    { name: "breakfast", icon: <EggFried size={44} color={accentClasses.primary} /> },
    { name: "lunch", icon: <CookingPot size={44} color={accentClasses.primary} /> },
    { name: "dinner", icon: <Pizza size={44} color={accentClasses.primary} /> },
    { name: "snack", icon: <Croissant size={44} color={accentClasses.primary} /> },
    { name: "dessert", icon: <CakeSlice size={44} color={accentClasses.primary} /> },
  ];

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    const recipes = await StorageService.getAllRecipes();
    // Sort by most recent and take first 5 as favorites
    const recent = recipes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
    setFavoriteRecipes(recent);
    setIsLoading(false);
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 p-6 pt-16">
        <ThemedText type="title" className="mb-2">
          Types
        </ThemedText>
        <ThemedText className="mb-6 opacity-70">
          Select one of the recipe types:
        </ThemedText>
        
        <ThemedView className="flex flex-row flex-wrap items-center justify-center gap-4 mb-8 bg-transparent">
          {recipeTypes.map((type) => (
            <RecipeType key={type.name} name={type.name} icon={type.icon} />
          ))}
        </ThemedView>

        <ThemedText type="title" className="mb-2">
          Favorites
        </ThemedText>
        <ThemedText className="mb-6 opacity-70">
          Your recently added recipes:
        </ThemedText>
        
        <ThemedView className="flex flex-col gap-4 bg-transparent">
          {favoriteRecipes.length > 0 ? (
            favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} id={recipe.id} name={recipe.title} img={recipe.img} />
            ))
          ) : (
            <ThemedText className="text-center opacity-50 py-8">
              {isLoading ? "Loading favorite recipes..." : "No recipes yet. Add your first recipe!"}
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bg-white dark:bg-black bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/add-recipe')}
        activeOpacity={0.8}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}