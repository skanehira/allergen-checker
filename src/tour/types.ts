import type { ReactNode } from "react";

export type TourStep = {
  selector: string | null;
  side: "top" | "bottom" | "left" | "right";
  title: string;
  content: ReactNode;
  highlightPadding?: number;
  nextRoute?: string;
  prevRoute?: string;
};

export type Tour = {
  name: string;
  steps: TourStep[];
};
