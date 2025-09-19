import { RecipeType } from "@/types/recipe";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getTotalCookingTime(recipe: RecipeType) {
  return recipe.steps.reduce((total, step) => total + step.duration, 0);
}
