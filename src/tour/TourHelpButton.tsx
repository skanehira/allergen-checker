import { useLocation } from "react-router-dom";
import { useTour } from "./useTour";
import {
  welcomeTour,
  importTour,
  recipeTour,
  courseTour,
  dashboardTour,
  kitchenTour,
  customerTour,
  allergenTour,
} from "./steps";
import type { Tour } from "./types";

const routeTourMap: Record<string, Tour> = {
  "/import": importTour,
  "/recipe": recipeTour,
  "/course": courseTour,
  "/dashboard": dashboardTour,
  "/kitchen": kitchenTour,
  "/customers": customerTour,
  "/allergens": allergenTour,
};

export function TourHelpButton() {
  const { startTour, activeTour } = useTour();
  const location = useLocation();

  function handleClick() {
    if (activeTour) return;
    const tour = routeTourMap[location.pathname] ?? welcomeTour;
    startTour(tour);
  }

  return (
    <button
      id="tour-help-btn"
      onClick={handleClick}
      className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:text-primary hover:border-primary/40 transition-colors cursor-pointer text-sm font-medium"
      title="ガイドを表示"
    >
      ?
    </button>
  );
}
