import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAccentClasses } from "@/hooks/use-system-accent";
import { StorageService } from "@/services/storage";
import { RecipeType } from "@/types/recipe";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Clock, Pizza, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, useColorScheme } from "react-native";

export default function RecipeViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [loading, setLoading] = useState(true);
  const accentColors = useAccentClasses();
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    if (!id) {
      router.back();
      return;
    }

    try {
      const recipes = await StorageService.getAllRecipes();
      const foundRecipe = recipes.find(r => r.id === id);
      
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        // Recipe not found, go back
        router.back();
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView 
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: accentColors.base }}
      >
        <ActivityIndicator size="large" color={accentColors.primary} />
        <ThemedText 
          className="mt-4"
          style={{ color: accentColors.subtext0 }}
        >
          Loading recipe...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!recipe) {
    return (
      <ThemedView 
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: accentColors.base }}
      >
        <ThemedText style={{ color: accentColors.text }}>
          Recipe not found
        </ThemedText>
      </ThemedView>
    );
  }

  const getTotalCookingTime = () => {
    return recipe.recipe.reduce((total, step) => total + step.duration, 0);
  };

  const getAllIngredients = () => {
    const ingredientMap = new Map<string, { name: string; unit?: string; quantity?: number }>();
    
    recipe.recipe.forEach(step => {
      step.ingredients.forEach(ingredient => {
        const key = `${ingredient.name}-${ingredient.unit || 'no-unit'}`;
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.quantity = (existing.quantity || 0) + (ingredient.quantity || 0);
        } else {
          ingredientMap.set(key, { ...ingredient });
        }
      });
    });

    return Array.from(ingredientMap.values());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categoryColors: Record<string, string> = {
    breakfast: colorScheme === 'dark' ? '#FCD34D' : '#F59E0B',
    lunch: colorScheme === 'dark' ? '#60A5FA' : '#3B82F6',
    dinner: colorScheme === 'dark' ? '#F87171' : '#EF4444',
    snack: colorScheme === 'dark' ? '#A78BFA' : '#8B5CF6',
    dessert: colorScheme === 'dark' ? '#FB7185' : '#EC4899'
  };

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: accentColors.base }}>
      {/* Header */}
      <ThemedView 
        className="flex-row items-center px-6 pt-16 pb-4"
        style={{ backgroundColor: accentColors.base }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color={accentColors.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={{ color: accentColors.text }}>
          Recipe
        </ThemedText>
      </ThemedView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Recipe Image and Title */}
        <ThemedView 
          className="px-6 pb-6"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedView 
            className="items-center mb-4"
            style={{ backgroundColor: accentColors.base }}
          >
            {recipe.img ? (
              <Image
                source={recipe.img}
                style={{ width: 200, height: 200, borderRadius: 16 }}
                contentFit="cover"
              />
            ) : (
              <ThemedView
                className="w-48 h-48 items-center justify-center rounded-2xl"
                style={{ backgroundColor: accentColors.surface }}
              >
                <Pizza size={80} color={accentColors.primary} />
              </ThemedView>
            )}
          </ThemedView>

          <ThemedText 
            type="title" 
            className="text-center mb-2"
            style={{ color: accentColors.text }}
          >
            {recipe.title}
          </ThemedText>

          {/* Recipe Meta Info */}
          <ThemedView 
            className="flex-row items-center justify-center gap-4 mb-4"
            style={{ backgroundColor: accentColors.base }}
          >
            <ThemedView 
              className="flex-row items-center gap-1"
              style={{ backgroundColor: accentColors.base }}
            >
              <Clock size={16} color={accentColors.subtext0} />
              <ThemedText 
                className="text-sm"
                style={{ color: accentColors.subtext0 }}
              >
                {getTotalCookingTime()} min
              </ThemedText>
            </ThemedView>
            
            <ThemedView 
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: categoryColors[recipe.category] }}
            >
              <ThemedText className="text-xs font-semibold text-white capitalize">
                {recipe.category}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText 
            className="text-center text-xs opacity-60"
            style={{ color: accentColors.subtext1 }}
          >
            Created {formatDate(recipe.createdAt)}
          </ThemedText>
        </ThemedView>

        {/* All Ingredients Section */}
        <ThemedView 
          className="mx-6 mb-6 rounded-2xl p-4"
          style={{ backgroundColor: accentColors.surface }}
        >
          <ThemedText 
            className="font-semibold mb-3 text-lg"
            style={{ color: accentColors.text }}
          >
            Ingredients
          </ThemedText>
          
          {getAllIngredients().map((ingredient, index) => (
            <ThemedView 
              key={index}
              className="flex-row items-center justify-between py-2 border-b border-opacity-20"
              style={{ 
                backgroundColor: accentColors.surface,
                borderBottomColor: accentColors.subtext0
              }}
            >
              <ThemedText style={{ color: accentColors.text }}>
                {ingredient.name}
              </ThemedText>
              <ThemedText 
                className="font-medium"
                style={{ color: accentColors.primary }}
              >
                {ingredient.quantity ? `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ''}` : ''}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Recipe Steps */}
        <ThemedView 
          className="mx-6 mb-6"
          style={{ backgroundColor: accentColors.base }}
        >
          <ThemedText 
            className="font-semibold mb-4 text-lg"
            style={{ color: accentColors.text }}
          >
            Instructions
          </ThemedText>

          {recipe.recipe.map((step, index) => (
            <ThemedView 
              key={index}
              className="mb-4 rounded-2xl p-4"
              style={{ backgroundColor: accentColors.surface }}
            >
              <ThemedView 
                className="flex-row items-center justify-between mb-3"
                style={{ backgroundColor: accentColors.surface }}
              >
                <ThemedView 
                  className="flex-row items-center gap-3"
                  style={{ backgroundColor: accentColors.surface }}
                >
                  <ThemedView
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: accentColors.primary }}
                  >
                    <ThemedText className="text-white font-bold">
                      {step.order}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText 
                    className="font-semibold"
                    style={{ color: accentColors.text }}
                  >
                    {step.name}
                  </ThemedText>
                </ThemedView>
                
                <ThemedView 
                  className="flex-row items-center gap-1"
                  style={{ backgroundColor: accentColors.surface }}
                >
                  <Clock size={14} color={accentColors.subtext0} />
                  <ThemedText 
                    className="text-sm"
                    style={{ color: accentColors.subtext0 }}
                  >
                    {step.duration} min
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedText 
                className="mb-3 leading-6"
                style={{ color: accentColors.subtext1 }}
              >
                {step.description}
              </ThemedText>

              {step.ingredients.length > 0 && (
                <ThemedView style={{ backgroundColor: accentColors.surface }}>
                  <ThemedText 
                    className="font-medium mb-2 text-sm"
                    style={{ color: accentColors.text }}
                  >
                    Step Ingredients:
                  </ThemedText>
                  {step.ingredients.map((ingredient, ingredientIndex) => (
                    <ThemedText 
                      key={ingredientIndex}
                      className="text-sm ml-2"
                      style={{ color: accentColors.subtext0 }}
                    >
                      • {ingredient.quantity ? `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ''} ` : ''}{ingredient.name}
                    </ThemedText>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
          ))}
        </ThemedView>

        {/* Bottom spacing for the fixed button */}
        <ThemedView style={{ height: 100, backgroundColor: accentColors.base }} />
      </ScrollView>

      {/* Cook Button */}
      <ThemedView 
        className="absolute bottom-0 left-0 right-0 p-6"
        style={{ backgroundColor: accentColors.base }}
      >
        <TouchableOpacity
          className="rounded-2xl py-4 items-center shadow-lg"
          style={{ backgroundColor: accentColors.primary }}
          activeOpacity={0.8}
        >
          <ThemedView 
            className="flex-row items-center gap-2"
            style={{ backgroundColor: 'transparent' }}
          >
            <User size={20} color="white" />
            <ThemedText className="text-white font-semibold text-lg">
              Start Cooking
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}