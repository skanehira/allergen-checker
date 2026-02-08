import { useState } from "react";
import { recipes as initialRecipes } from "../data/mock";
import type { Recipe } from "../data/mock";

const STORAGE_KEY = "recipes";

function loadFromStorage(): Recipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialRecipes;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialRecipes;
  } catch {
    return initialRecipes;
  }
}

function saveToStorage(items: Recipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useRecipes() {
  const [recipes, setRecipesState] = useState<Recipe[]>(loadFromStorage);

  function setRecipes(updater: Recipe[] | ((prev: Recipe[]) => Recipe[])) {
    setRecipesState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(next);
      return next;
    });
  }

  return [recipes, setRecipes] as const;
}
