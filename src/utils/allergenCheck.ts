import type { Ingredient, Recipe, Judgment } from "../data/types";

export type IngredientCheckResult = {
  judgment: Judgment;
  matchedAllergens: string[];
};

export type DishCheckResult = {
  judgment: Judgment;
  matchedAllergens: string[];
  hasUnknown: boolean;
};

export function checkIngredient(
  ingredient: Ingredient,
  customerAllergens: string[],
): IngredientCheckResult {
  const matchedAllergens = ingredient.allergens.filter((a) => customerAllergens.includes(a));
  let judgment: Judgment;
  if (ingredient.allergenUnknown) {
    judgment = matchedAllergens.length > 0 ? "NG" : "要確認";
  } else {
    judgment = matchedAllergens.length > 0 ? "NG" : "OK";
  }
  return { judgment, matchedAllergens };
}

export function checkDish(recipe: Recipe, customerAllergens: string[]): DishCheckResult {
  const results = recipe.linkedIngredients.map((i) => checkIngredient(i, customerAllergens));
  const allMatched = [...new Set(results.flatMap((r) => r.matchedAllergens))];
  const hasUnknown = recipe.linkedIngredients.some((i) => i.allergenUnknown);
  const judgments = results.map((r) => r.judgment);
  let judgment: Judgment;
  if (judgments.includes("NG")) judgment = "NG";
  else if (judgments.includes("要確認")) judgment = "要確認";
  else judgment = "OK";
  return { judgment, matchedAllergens: allMatched, hasUnknown };
}

export function judgmentIcon(j: Judgment) {
  switch (j) {
    case "NG":
      return "✕";
    case "要確認":
      return "△";
    case "OK":
      return "○";
  }
}
