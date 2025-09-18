// services/storage.ts
import { RecipeType } from '@/types/recipe';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECIPES_KEY = '@recipes';

export class StorageService {
  static async getAllRecipes(): Promise<RecipeType[]> {
    try {
      const recipesJson = await AsyncStorage.getItem(RECIPES_KEY);
      if (recipesJson) {
        const recipes = JSON.parse(recipesJson);
        return recipes.map((recipe: any) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt),
          updatedAt: new Date(recipe.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading recipes:', error);
      return [];
    }
  }

  static async saveRecipe(recipe: Omit<RecipeType, 'id' | 'createdAt' | 'updatedAt'>): Promise<RecipeType> {
    try {
      const recipes = await this.getAllRecipes();
      const newRecipe: RecipeType = {
        ...recipe,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      recipes.push(newRecipe);
      await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
      return newRecipe;
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  }

  static async updateRecipe(id: string, updates: Partial<RecipeType>): Promise<RecipeType | null> {
    try {
      const recipes = await this.getAllRecipes();
      const index = recipes.findIndex(recipe => recipe.id === id);
      
      if (index !== -1) {
        recipes[index] = {
          ...recipes[index],
          ...updates,
          updatedAt: new Date()
        };
        await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
        return recipes[index];
      }
      return null;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  }

  static async deleteRecipe(id: string): Promise<boolean> {
    try {
      const recipes = await this.getAllRecipes();
      const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
      await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(filteredRecipes));
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    }
  }

  // Favs management
  static async toggleFavorite(id: string): Promise<boolean> {
    try {
      const recipes = await this.getAllRecipes();
      const recipeIndex = recipes.findIndex(r => r.id === id);
      
      if (recipeIndex === -1) return false;

      recipes[recipeIndex].isFavorite = !recipes[recipeIndex].isFavorite;
      recipes[recipeIndex].updatedAt = new Date();
      await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async getFavoriteRecipes(): Promise<RecipeType[]> {
    const recipes = await this.getAllRecipes();
    return recipes.filter(recipe => recipe.isFavorite === true);
  }
}