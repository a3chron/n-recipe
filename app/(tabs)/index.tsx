import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Recipe from "@/components/ui/recipe";
import RecipeType from "@/components/ui/type";
import {
  CakeSlice,
  CookingPot,
  Croissant,
  EggFried,
  Pizza,
} from "lucide-react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  titleContainer: {
    padding: 20,
    paddingTop: 44,
    gap: 8,
  },
});

const recipeTypes = [
  { name: "morning", icon: <EggFried size={44} color="red" /> },
  { name: "midday", icon: <CookingPot size={44} color="red" /> },
  { name: "evening", icon: <Pizza size={44} color="red" /> },
  { name: "snack", icon: <Croissant size={44} color="red" /> },
  { name: "dessert", icon: <CakeSlice size={44} color="red" /> },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Types</ThemedText>
      <ThemedText>Select of one of the recipe types:</ThemedText>
      <ThemedView className="flex flex-row flex-wrap items-center justify-center gap-4 my-6">
        {recipeTypes.map((type) => (
          <RecipeType key={type.name} name={type.name} icon={type.icon} />
        ))}
      </ThemedView>

      <ThemedText type="title">Favorites</ThemedText>
      <ThemedView className="flex flex-row flex-wrap items-center justify-center gap-4 my-6">
        {recipeTypes.map((type) => (
          <Recipe key={type.name} name={type.name} />
        ))}
      </ThemedView>
    </ThemedView>
  );
}
