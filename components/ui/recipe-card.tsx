import { Image } from "expo-image";
import { router } from "expo-router";
import { Pizza } from "lucide-react-native";
import { Text, TouchableOpacity, useColorScheme } from "react-native";

export default function RecipeCard({ 
  name, 
  img, 
  id,
}: { 
  name: string; 
  id: string;
  img?: string; 
}) {
  const colorScheme = useColorScheme();
  
  return (
    <TouchableOpacity 
      onPress={() => router.push(`/recipe/${id}`)}
      className={`flex items-center justify-center gap-4 p-6 rounded-2xl w-full ${
        colorScheme === 'dark' 
          ? 'bg-neutral-800 border border-neutral-700' 
          : 'bg-neutral-100 border border-neutral-200'
      }`}
      activeOpacity={0.8}
    >
      {img === undefined ? (
        <Pizza size={44} color="#C8102E" />
      ) : (
        <Image 
          source={img} 
          style={{ width: 64, height: 64, borderRadius: 8 }}
          contentFit="cover"
        />
      )}
      <Text className={`font-medium text-center ${
        colorScheme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'
      }`}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}