import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import RecipeCard from "@/components/ui/recipe-card";
import { useAccentColors } from "@/hooks/use-system-accent";
import { getTotalCookingTime } from "@/lib/utils";
import { StorageService } from "@/services/storage";
import { RecipeCategoryType, RecipeType } from "@/types/recipe";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterState = {
  category: RecipeCategoryType | "all";
  cookingTime: "all" | "0-30" | "30-60" | "60+";
};

type RecipeWithCookingTime = RecipeType & {
  totalCookingTime: number;
};

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<RecipeWithCookingTime[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const accentColors = useAccentColors();

  // Get search params for initial filtering
  const { category: initialCategory } = useLocalSearchParams<{
    category?: RecipeCategoryType;
  }>();

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || "all",
    cookingTime: "all",
  });

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const allRecipes = await StorageService.getAllRecipes();

      // Calculate cooking times for all recipes
      const recipesWithCookingTime: RecipeWithCookingTime[] = allRecipes.map(
        (recipe) => ({
          ...recipe,
          totalCookingTime: getTotalCookingTime(recipe),
        }),
      );

      // Sort by most recent first
      const sortedRecipes = recipesWithCookingTime.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      );

      setRecipes(sortedRecipes);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, []),
  );

  // Update filters when search params change
  useEffect(() => {
    if (initialCategory && initialCategory !== filters.category) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Category filter
      if (filters.category !== "all" && recipe.category !== filters.category) {
        return false;
      }

      // Cooking time filter
      if (filters.cookingTime !== "all") {
        const cookingTime = recipe.totalCookingTime;
        switch (filters.cookingTime) {
          case "0-30":
            if (cookingTime > 30) return false;
            break;
          case "30-60":
            if (cookingTime <= 30 || cookingTime > 60) return false;
            break;
          case "60+":
            if (cookingTime <= 60) return false;
            break;
        }
      }

      return true;
    });
  }, [recipes, filters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const renderRecipe = ({ item }: { item: RecipeWithCookingTime }) => (
    <RecipeCard recipe={item} />
  );

  const categories: { value: RecipeCategoryType | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
    { value: "dessert", label: "Dessert" },
  ];

  const cookingTimes: { value: FilterState["cookingTime"]; label: string }[] = [
    { value: "all", label: "Any time" },
    { value: "0-30", label: "≤ 30 min" },
    { value: "30-60", label: "30-60 min" },
    { value: "60+", label: "60+ min" },
  ];

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "all") count++;
    if (filters.cookingTime !== "all") count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({ category: "all", cookingTime: "all" });
  };

  const FilterChip = ({
    selected,
    onPress,
    children,
  }: {
    selected: boolean;
    onPress: () => void;
    children: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: selected ? accentColors.primary : "transparent",
        borderColor: selected ? accentColors.primary : accentColors.surface,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: selected ? accentColors.base : accentColors.text,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView className="flex-1">
      <ThemedView className="px-6 pt-16 pb-4 bg-transparent">
        <View className="flex-row items-center justify-between">
          <View>
            <ThemedText type="title">
              {filters.category === "all"
                ? "All Recipes"
                : `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Recipes`}
            </ThemedText>
            <ThemedText className="opacity-70 mt-2">
              {filteredRecipes.length} recipe
              {filteredRecipes.length !== 1 ? "s" : ""}
              {activeFiltersCount > 0 && ` (filtered)`}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              backgroundColor:
                activeFiltersCount > 0 ? accentColors.primary : "transparent",
              borderColor:
                activeFiltersCount > 0
                  ? accentColors.primary
                  : accentColors.surface,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color:
                  activeFiltersCount > 0
                    ? accentColors.base
                    : accentColors.text,
              }}
            >
              Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {showFilters && (
        <ThemedView className="px-6 pb-4 bg-transparent">
          <View className="mb-4">
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 8,
                color: accentColors.subtext0,
              }}
            >
              Category
            </Text>
            <View className="flex-row flex-wrap">
              {categories.map((category) => (
                <FilterChip
                  key={category.value}
                  selected={filters.category === category.value}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: category.value,
                    }))
                  }
                >
                  {category.label}
                </FilterChip>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 8,
                color: accentColors.subtext0,
              }}
            >
              Cooking Time
            </Text>
            <View className="flex-row flex-wrap">
              {cookingTimes.map((time) => (
                <FilterChip
                  key={time.value}
                  selected={filters.cookingTime === time.value}
                  onPress={() =>
                    setFilters((prev) => ({ ...prev, cookingTime: time.value }))
                  }
                >
                  {time.label}
                </FilterChip>
              ))}
            </View>
          </View>

          {activeFiltersCount > 0 && (
            <TouchableOpacity
              onPress={clearFilters}
              style={{
                backgroundColor: accentColors.surface,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ fontSize: 14, color: accentColors.subtext0 }}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}

      {loading ? (
        <ThemedView className="flex-1 items-center justify-center px-6 bg-transparent">
          <ThemedText className="text-center opacity-50 text-lg">
            Loading recipes...
          </ThemedText>
        </ThemedView>
      ) : filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
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
            {recipes.length === 0
              ? "No recipes yet"
              : "No recipes match your filters"}
          </ThemedText>
          <ThemedText className="text-center opacity-40 mt-2">
            {recipes.length === 0
              ? "Add your first recipe from the home screen"
              : "Try adjusting your filters or adding more recipes"}
          </ThemedText>
          {activeFiltersCount > 0 && (
            <TouchableOpacity
              onPress={clearFilters}
              style={{
                backgroundColor: accentColors.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 20,
                marginTop: 16,
              }}
            >
              <Text style={{ color: accentColors.base, fontWeight: "500" }}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
}
