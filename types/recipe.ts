export type RecipeType = {
  id: string;
  title: string;
  description?: string; //TODO: handle adding this
  servings: number;
  img?: string;
  isFavorite?: boolean;
  category: RecipeCategoryType;
  tags?: string[]; //TODO: handle adding this
  difficulty?: "easy" | "medium" | "hard"; //TODO: handle adding this
  steps: RecipeStepType[];
  createdAt: Date;
  updatedAt: Date;
}

export type RecipeStepType = {
  name: string;
  order: number;
  description: string;
  duration: number; // in minutes
  ingredients: IngredientType[];
}

export type IngredientType = {
  name: string;
  unit?: string;
  quantity?: number;
}

export type RecipeCategoryType = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";