export type RecipeType = {
  id: string;
  title: string;
  img?: string;
  category: RecipeCategoryType;
  recipe: RecipeStepType[];
  createdAt: Date;
  updatedAt: Date;
}

export type RecipeStepType = {
  name: string;
  order: number;
  description: string;
  duration: number; // minutes
  ingredients: IngredientType[];
}

export type IngredientType = {
  name: string;
  unit?: string;
  quantity?: number;
}

export type RecipeCategoryType = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";