import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAccentColors } from "@/hooks/use-system-accent";
import { RecipeType } from "@/types/recipe";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChefHat, ShoppingCart } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity } from "react-native";

export default function IngredientsOverviewScreen() {
  const { servings, recipe } = useLocalSearchParams<{
    servings: string;
    recipe: string;
  }>();
  const recipeData: RecipeType = JSON.parse(recipe || "{}");
  const selectedServings = parseInt(servings || "1");
  const originalServings = recipeData.servings;
  const servingMultiplier = selectedServings / originalServings;
  const accentColors = useAccentColors();
  const { t } = useTranslation();

  const getAllIngredients = () => {
    const ingredientMap = new Map<
      string,
      { name: string; unit?: string; quantity?: number }
    >();

    recipeData.steps.forEach((step) => {
      step.ingredients.forEach((ingredient) => {
        const key = `${ingredient.name}-${ingredient.unit || "no-unit"}`;
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.quantity =
            (existing.quantity || 0) + (ingredient.quantity || 0);
        } else {
          ingredientMap.set(key, { ...ingredient });
        }
      });
    });

    return Array.from(ingredientMap.values()).map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity
        ? Math.round(ingredient.quantity * servingMultiplier * 100) / 100
        : ingredient.quantity,
    }));
  };

  const handleStartCooking = () => {
    router.push({
      pathname: "/cooking/step/[id]",
      params: {
        id: recipeData.id,
        servings: servings,
        recipe: recipe,
        currentStep: "0",
      },
    });
  };

  const formatQuantity = (quantity?: number, unit?: string) => {
    if (!quantity) return "";

    // Format decimal numbers nicely
    let displayQuantity = quantity;
    if (quantity % 1 !== 0) {
      // If it's a decimal, show up to 2 decimal places
      displayQuantity = Math.round(quantity * 100) / 100;
    }

    return `${displayQuantity}${unit ? ` ${unit}` : ""}`;
  };

  const ingredients = getAllIngredients();

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
          style={{ color: accentColors.text }}
          className="flex-1"
        >
          {t("cook.ingredientsNeeded")}
        </ThemedText>
      </ThemedView>

      {/* Recipe Info */}
      <ThemedView
        className="px-6 pb-4"
        style={{ backgroundColor: accentColors.base }}
      >
        <ThemedText
          className="text-center text-lg font-medium mb-2"
          style={{ color: accentColors.text }}
        >
          {recipeData.title}
        </ThemedText>
        <ThemedText
          className="text-center"
          style={{ color: accentColors.subtext1 }}
        >
          {t("cook.servingsCount", { count: selectedServings })}
        </ThemedText>
        {selectedServings !== originalServings && (
          <ThemedText
            className="text-center text-xs mt-1"
            style={{ color: accentColors.subtext0 }}
          >
            {t("cook.adjustedFrom", { original: originalServings })}
          </ThemedText>
        )}
      </ThemedView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Ingredients List */}
        <ThemedView
          className="mx-6 mb-6 rounded-2xl p-4"
          style={{ backgroundColor: accentColors.surface }}
        >
          <ThemedView
            className="flex-row items-center gap-2 mb-4"
            style={{ backgroundColor: accentColors.surface }}
          >
            <ShoppingCart size={20} color={accentColors.primary} />
            <ThemedText
              className="font-semibold text-lg"
              style={{ color: accentColors.text }}
            >
              {t("cook.shoppingList")}
            </ThemedText>
          </ThemedView>

          {ingredients.map((ingredient, index) => (
            <ThemedView
              key={index}
              className="flex-row items-center justify-between py-3 border-b"
              style={{
                backgroundColor: accentColors.surface,
                borderBottomColor: accentColors.base,
                borderBottomWidth: index === ingredients.length - 1 ? 0 : 1,
              }}
            >
              <ThemedText
                className="flex-1 text-base"
                style={{ color: accentColors.text }}
              >
                {ingredient.name}
              </ThemedText>
              <ThemedText
                className="font-semibold text-base"
                style={{ color: accentColors.primary }}
              >
                {formatQuantity(ingredient.quantity, ingredient.unit)}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Instructions */}
        <ThemedView
          className="mx-6 mb-6 rounded-2xl p-4"
          style={{ backgroundColor: accentColors.surface }}
        >
          <ThemedText
            className="font-medium mb-2"
            style={{ color: accentColors.text }}
          >
            {t("cook.beforeStarting")}
          </ThemedText>
          <ThemedText
            className="text-sm leading-5"
            style={{ color: accentColors.subtext1 }}
          >
            {t("cook.prepareIngredients")}
          </ThemedText>
        </ThemedView>

        {/* Bottom spacing */}
        <ThemedView
          style={{ height: 100, backgroundColor: accentColors.base }}
        />
      </ScrollView>

      {/* Start Cooking Button */}
      <ThemedView
        className="absolute bottom-0 left-0 right-0 p-6"
        style={{ backgroundColor: accentColors.base }}
      >
        <TouchableOpacity
          className="rounded-2xl py-4 items-center shadow-lg"
          style={{ backgroundColor: accentColors.primary }}
          activeOpacity={0.8}
          onPress={handleStartCooking}
        >
          <ThemedView
            className="flex-row items-center gap-2"
            style={{ backgroundColor: "transparent" }}
          >
            <ChefHat size={20} color={accentColors.crust} />
            <ThemedText type="button" className="font-semibold text-lg">
              {t("cook.startCooking")}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
