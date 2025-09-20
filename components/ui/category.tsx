import { useAccentColors } from "@/hooks/use-system-accent";
import { RecipeCategoryType } from "@/types/recipe";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

const navigateToFilteredRecipes = (category: RecipeCategoryType) => {
  router.push({
    pathname: "/(tabs)/recipes",
    params: { category },
  });
};

export default function RecipeType({
  name,
  category,
  icon,
}: {
  name: string;
  category: RecipeCategoryType;
  icon: React.ReactNode;
}) {
  const accentClasses = useAccentColors();

  return (
    <TouchableOpacity
      onPress={() => navigateToFilteredRecipes(category)}
      className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 w-32"
      style={{
        backgroundColor: `${accentClasses.tertiary}20`,
        borderColor: accentClasses.primary,
      }}
      activeOpacity={0.8}
    >
      {icon}
      <Text
        className="font-medium capitalize"
        style={{ color: accentClasses.primary }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}
