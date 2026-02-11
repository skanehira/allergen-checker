import { useState } from "react";
import type { CustomerCourseAssignment } from "../data/types";

const STORAGE_KEY = "assignments";

function loadFromStorage(): CustomerCourseAssignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CustomerCourseAssignment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useAssignments() {
  const [assignments, setAssignmentsState] = useState<CustomerCourseAssignment[]>(loadFromStorage);

  function setAssignments(
    updater:
      | CustomerCourseAssignment[]
      | ((prev: CustomerCourseAssignment[]) => CustomerCourseAssignment[]),
  ) {
    setAssignmentsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(next);
      return next;
    });
  }

  return [assignments, setAssignments] as const;
}
