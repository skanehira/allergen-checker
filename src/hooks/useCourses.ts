import { useState } from "react";
import { courses as initialCourses } from "../data/mock";
import type { Course } from "../data/types";

const STORAGE_KEY = "courses";

function isValidCourses(data: unknown): data is Course[] {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return true;
  return Array.isArray(data[0].dishIds);
}

function loadFromStorage(): Course[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialCourses;
    const parsed = JSON.parse(raw);
    if (!isValidCourses(parsed)) {
      saveToStorage(initialCourses);
      return initialCourses;
    }
    return parsed;
  } catch {
    return initialCourses;
  }
}

function saveToStorage(items: Course[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCourses() {
  const [courses, setCoursesState] = useState<Course[]>(loadFromStorage);

  function setCourses(updater: Course[] | ((prev: Course[]) => Course[])) {
    setCoursesState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(next);
      return next;
    });
  }

  return [courses, setCourses] as const;
}
