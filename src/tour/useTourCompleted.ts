import { useCallback } from "react";

const STORAGE_KEY = "tour_completed";

function getCompleted(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCompleted(names: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

export function useTourCompleted() {
  const isCompleted = useCallback((name: string) => {
    return getCompleted().includes(name);
  }, []);

  const markCompleted = useCallback((name: string) => {
    const current = getCompleted();
    if (!current.includes(name)) {
      setCompleted([...current, name]);
    }
  }, []);

  const reset = useCallback((name: string) => {
    setCompleted(getCompleted().filter((n) => n !== name));
  }, []);

  return { isCompleted, markCompleted, reset };
}
