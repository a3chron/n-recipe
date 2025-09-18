import { useAccentColors } from "@/hooks/use-system-accent";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pizza } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";

export default function RecipeCard({ 
  name, 
  img, 
  id,
}: { 
  name: string; 
  id: string;
  img?: string; 
}) {
  const accentColors = useAccentColors();

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/recipe/${id}`)}
      className="flex items-center justify-center gap-4 p-6 rounded-2xl w-full border"
      style={{backgroundColor: accentColors.mantle, borderColor: accentColors.crust}}
      activeOpacity={0.8}
    >
      {img === undefined ? (
        <Pizza size={44} color={accentColors.primary} />
      ) : (
        <Image 
          source={img} 
          style={{ width: 64, height: 64, borderRadius: 8 }}
          contentFit="cover"
        />
      )}
      <ThemedText className="font-medium text-center">
        {name}
      </ThemedText>
    </TouchableOpacity>
  );
}