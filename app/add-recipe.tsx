// app/add-recipe.tsx
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAccentClasses } from "@/hooks/use-system-accent";
import { StorageService } from "@/services/storage";
import { IngredientType, RecipeCategoryType, RecipeStepType } from "@/types/recipe";
import { router } from "expo-router";
import { ArrowLeft, Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme
} from "react-native";

const categories: RecipeCategoryType[] = ["breakfast", "lunch", "dinner", "snack", "dessert"];

export default function AddRecipeScreen() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategoryType>("dinner");
  const [steps, setSteps] = useState<RecipeStepType[]>([
    { name: "", order: 1, description: "", ingredients: [], duration: 0 }
  ]);
  const [saving, setSaving] = useState(false);
  
  const accentClasses = useAccentClasses();
  const colorScheme = useColorScheme();

  const addStep = () => {
    setSteps([...steps, { 
      name: "", 
      order: steps.length + 1, 
      description: "", 
      ingredients: [],
      duration: 0,
    }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      // Reorder the remaining steps
      const reorderedSteps = newSteps.map((step, i) => ({ ...step, order: i + 1 }));
      setSteps(reorderedSteps);
    }
  };

  const updateStep = (index: number, field: keyof RecipeStepType, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addIngredient = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].ingredients.push({ name: "", unit: "", quantity: 0 });
    setSteps(newSteps);
  };

  const removeIngredient = (stepIndex: number, ingredientIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].ingredients = newSteps[stepIndex].ingredients.filter(
      (_, i) => i !== ingredientIndex
    );
    setSteps(newSteps);
  };

  const updateIngredient = (stepIndex: number, ingredientIndex: number, field: keyof IngredientType, value: any) => {
    const newSteps = [...steps];
    newSteps[stepIndex].ingredients[ingredientIndex] = {
      ...newSteps[stepIndex].ingredients[ingredientIndex],
      [field]: value
    };
    setSteps(newSteps);
  };

  const saveRecipe = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a recipe title");
      return;
    }

    if (steps.some(step => !step.name.trim() || !step.description.trim())) {
      Alert.alert("Error", "Please fill in all step names and descriptions");
      return;
    }

    setSaving(true);
    try {
      await StorageService.saveRecipe({
        title: title.trim(),
        category: selectedCategory,
        recipe: steps
      });
      
      Alert.alert("Success", "Recipe saved successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save recipe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = colorScheme === 'dark' 
    ? 'bg-neutral-800 text-white border-neutral-600' 
    : 'bg-white text-black border-neutral-300';
  
  const categoryBorderColor = colorScheme === "light" ? "#525252" : "#d4d4d4"

  return (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior='height'
    >
      <ThemedView className="flex-1">
        {/* Header */}
        <ThemedView className="flex-row items-center px-6 pt-16 pb-4 bg-transparent">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color={colorScheme === "light" ? "#525252" : "#a3a3a3"} />
          </TouchableOpacity>
          <ThemedText type="title">Add Recipe</ThemedText>
        </ThemedView>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Recipe Title */}
          <ThemedView className="mb-6 bg-transparent">
            <ThemedText className="mb-2 font-semibold">Title *</ThemedText>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter recipe title"
              className={`border rounded-xl p-4 ${inputClass}`}
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </ThemedView>

          {/* Category Selection */}
          <ThemedView className="mb-6 bg-transparent">
            <ThemedText className="mb-3 font-semibold">Category</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ThemedView className="flex-row gap-3 bg-transparent">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    className="px-4 py-2 rounded-full border"
                    style={{borderColor: selectedCategory === category ? accentClasses.primary : categoryBorderColor}}
                  >
                    <ThemedText 
                      className={selectedCategory === category ? 'text-white' : ''}
                    >
                      {category}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ScrollView>
          </ThemedView>

          {/* Recipe Steps */}
          <ThemedView className="mb-6 bg-transparent">
            <ThemedView className="flex-row items-center justify-between mb-4 bg-transparent">
              <ThemedText className="font-semibold">Steps</ThemedText>
              <TouchableOpacity 
                onPress={addStep}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{backgroundColor: accentClasses.primary}}
              >
                <Plus size={16} color="white" />
              </TouchableOpacity>
            </ThemedView>

            {steps.map((step, stepIndex) => (
              <ThemedView key={stepIndex} className="mb-6 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 bg-transparent">
                <ThemedView className="flex-row items-center justify-between mb-3 bg-transparent">
                  <ThemedText className="font-semibold">Step {step.order}</ThemedText>
                  {steps.length > 1 && (
                    <TouchableOpacity onPress={() => removeStep(stepIndex)}>
                      <Minus size={20} color="red" />
                    </TouchableOpacity>
                  )}
                </ThemedView>

                <TextInput
                  value={step.name}
                  onChangeText={(value) => updateStep(stepIndex, 'name', value)}
                  placeholder="Step name (e.g., 'Prepare ingredients')"
                  className={`border rounded-lg p-3 mb-3 ${inputClass}`}
                  placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                />

                <TextInput
                  value={step.description}
                  onChangeText={(value) => updateStep(stepIndex, 'description', value)}
                  placeholder="Step description"
                  multiline
                  numberOfLines={3}
                  className={`border rounded-lg p-3 mb-4 ${inputClass}`}
                  placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                />

                {/* Ingredients for this step */}
                <ThemedView className="bg-transparent">
                  <ThemedView className="flex-row items-center justify-between mb-3 bg-transparent">
                    <ThemedText className="font-medium">Ingredients</ThemedText>
                    <TouchableOpacity 
                      onPress={() => addIngredient(stepIndex)}
                      className="w-6 h-6 rounded-full items-center justify-center"
                      style={{backgroundColor: accentClasses.primary}}
                    >
                      <Plus size={12} color="white" />
                    </TouchableOpacity>
                  </ThemedView>

                  {step.ingredients.map((ingredient, ingredientIndex) => (
                    <ThemedView key={ingredientIndex} className="flex-row items-center mb-2 gap-2 bg-transparent">
                      <TextInput
                        value={ingredient.name}
                        onChangeText={(value) => updateIngredient(stepIndex, ingredientIndex, 'name', value)}
                        placeholder="Ingredient"
                        className={`flex-1 border rounded-lg p-2 ${inputClass}`}
                        placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                      <TextInput
                        value={(ingredient.quantity ?? 0).toString()}
                        onChangeText={(value) => updateIngredient(stepIndex, ingredientIndex, 'quantity', parseFloat(value) || 0)}
                        placeholder="Amount"
                        keyboardType="numeric"
                        className={`w-20 border rounded-lg p-2 ${inputClass}`}
                        placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                      <TextInput
                        value={ingredient.unit}
                        onChangeText={(value) => updateIngredient(stepIndex, ingredientIndex, 'unit', value)}
                        placeholder="Unit"
                        className={`w-16 border rounded-lg p-2 ${inputClass}`}
                        placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                      {step.ingredients.length > 0 && (
                        <TouchableOpacity onPress={() => removeIngredient(stepIndex, ingredientIndex)}>
                          <Minus size={16} color="red" />
                        </TouchableOpacity>
                      )}
                    </ThemedView>
                  ))}

                  {step.ingredients.length === 0 && (
                    <ThemedText className="opacity-50 text-center py-4">
                      No ingredients added yet
                    </ThemedText>
                  )}
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ScrollView>

        {/* Save Button */}
        <ThemedView className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-transparent">
          <TouchableOpacity
            onPress={saveRecipe}
            disabled={saving}
            className="pb-6 rounded-xl items-center disabled:opacity-50"
            style={{backgroundColor: accentClasses.tertiary}}
          >
            <ThemedText className="text-white font-semibold text-lg">
              {saving ? 'Saving...' : 'Save Recipe'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}