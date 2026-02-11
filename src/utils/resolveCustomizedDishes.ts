import type { Recipe, DishCustomization } from "../data/types";

export type ResolvedDish = {
  recipe: Recipe;
  customization?: DishCustomization;
  isCustomized: boolean;
  isRemoved: boolean;
};

export function resolveCustomizedDishes(
  dishIds: number[],
  allRecipes: Recipe[],
  customizations: DishCustomization[],
): ResolvedDish[] {
  return dishIds
    .map((dishId) => {
      const customization = customizations.find((c) => c.originalDishId === dishId);
      const original = allRecipes.find((r) => r.id === dishId);

      if (!original) return null;

      if (customization) {
        if (customization.action === "remove") {
          return { recipe: original, customization, isCustomized: true, isRemoved: true };
        }
        if (customization.action === "replace" && customization.replacementDishId) {
          const replacement = allRecipes.find((r) => r.id === customization.replacementDishId);
          if (replacement) {
            return { recipe: replacement, customization, isCustomized: true, isRemoved: false };
          }
        }
        return { recipe: original, customization, isCustomized: true, isRemoved: false };
      }

      return { recipe: original, isCustomized: false, isRemoved: false };
    })
    .filter((d): d is ResolvedDish => d !== null);
}

export function customizationLabel(action: DishCustomization["action"]): string {
  switch (action) {
    case "replace":
      return "差し替え済";
    case "modify":
      return "変更あり";
    case "remove":
      return "除外";
  }
}
