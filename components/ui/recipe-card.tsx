import { useAccentColors } from "@/hooks/use-system-accent";
import { getTotalCookingTime } from "@/lib/utils";
import { RecipeType } from "@/types/recipe";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Clock, Pizza, User } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

export default function RecipeCard({recipe}: {recipe: RecipeType}) {
  const accentColors = useAccentColors();

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      className="flex items-center justify-center gap-4 p-6 rounded-3xl w-full border"
      style={{backgroundColor: accentColors.mantle, borderColor: accentColors.crust}}
      activeOpacity={0.8}
    >
      {recipe.img === undefined ? (
        <Pizza size={44} color={accentColors.primary} />
      ) : (
        <Image 
          source={recipe.img} 
          style={{ width: 64, height: 64, borderRadius: 8 }}
          contentFit="cover"
        />
      )}
      <View className="w-full">
        <ThemedText type="subtitle">
          {recipe.title}
        </ThemedText>
        <View className="flex-row gap-1 items-center mt-2">
          <Text style={{color: accentColors.subtext1}}>{recipe.servings}</Text>
          <User size={14} color={accentColors.subtext1} />

          <Text style={{color: accentColors.subtext1, paddingLeft: 8}}>{getTotalCookingTime(recipe)}m</Text>
          <Clock size={14} color={accentColors.subtext1} />
        </View>
        {recipe.description && recipe.description !== "" && (
          <ThemedText>
            {recipe.description}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}