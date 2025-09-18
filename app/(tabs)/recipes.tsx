// app/(tabs)/recipes.tsx
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import RecipeCard from "@/components/ui/recipe-card";
import { StorageService } from "@/services/storage";
import { RecipeType } from "@/types/recipe";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecipes = async () => {
    const allRecipes = await StorageService.getAllRecipes();
    // Sort by most recent first
    const sortedRecipes = allRecipes.sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
    setRecipes(sortedRecipes);
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const renderRecipe = ({ item }: { item: RecipeType }) => (
    <RecipeCard id={item.id} name={item.title} img={item.img} />
  );

  return (
    <ThemedView className="flex-1">
      <ThemedView className="px-6 pt-16 pb-4 bg-transparent">
        <ThemedText type="title">All Recipes</ThemedText>
        <ThemedText className="opacity-70 mt-2">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </ThemedText>
      </ThemedView>

      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 24,
            paddingTop: 0,
            gap: 16,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView className="flex-1 items-center justify-center px-6 bg-transparent">
          <ThemedText className="text-center opacity-50 text-lg">
            No recipes yet
          </ThemedText>
          <ThemedText className="text-center opacity-40 mt-2">
            Add your first recipe from the home screen
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}