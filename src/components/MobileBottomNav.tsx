import { useLocation, useNavigate } from "react-router-dom";
import type { Step } from "./Sidebar";

type Props = {
  steps: Step[];
};

export function MobileBottomNav({ steps }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = steps.findIndex((s) => s.path === location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-primary-dark safe-area-bottom md:hidden animate-slide-up">
      <div className="flex">
        {steps.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          return (
            <button
              key={step.id}
              onClick={() => navigate(step.path)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[56px] gap-1 transition-colors cursor-pointer ${
                isActive
                  ? "bg-white/10 text-white"
                  : isCompleted
                    ? "text-white/60"
                    : "text-white/35"
              }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 ${
                  isActive
                    ? "bg-white text-primary-dark"
                    : isCompleted
                      ? "border border-white/40 text-white/70"
                      : "border border-white/15 text-white/30"
                }`}
              >
                {isCompleted ? "✓" : step.id}
              </span>
              <span className="text-[10px] truncate max-w-full px-1">{step.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
