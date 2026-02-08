import { useState } from "react";

const STORAGE_KEY = "custom-allergens";

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCustomAllergens() {
  const [items, setItems] = useState<string[]>(loadFromStorage);

  function add(name: string): { ok: boolean; error?: string } {
    const trimmed = name.trim();
    if (!trimmed) {
      return { ok: false, error: "名前を入力してください" };
    }
    if (items.includes(trimmed)) {
      return { ok: false, error: "同名のカスタムアレルゲンが既に登録されています" };
    }
    const next = [...items, trimmed];
    setItems(next);
    saveToStorage(next);
    return { ok: true };
  }

  function remove(name: string) {
    const next = items.filter((i) => i !== name);
    setItems(next);
    saveToStorage(next);
  }

  return { items, add, remove } as const;
}
