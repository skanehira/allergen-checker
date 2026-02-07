import { useLocation, useNavigate } from "react-router-dom";

export type Step = {
  id: number;
  label: string;
  path: string;
};

type Props = {
  steps: Step[];
};

export function Sidebar({ steps }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = steps.findIndex((s) => s.path === location.pathname);

  return (
    <aside className="w-60 shrink-0 bg-primary-dark text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 border-b border-white/10">
        <p className="font-display text-[11px] tracking-[0.25em] text-white/50 mb-1">
          ALLERGEN CHECKER
        </p>
      </div>

      {/* Steps */}
      <nav className="flex-1 px-3 py-5">
        <ul className="space-y-0.5">
          {steps.map((step, idx) => {
            const isActive = idx === currentIndex;
            const isCompleted = idx < currentIndex;
            return (
              <li key={step.id}>
                <button
                  onClick={() => navigate(step.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/12 text-white font-semibold"
                      : isCompleted
                        ? "text-white/65 hover:bg-white/6 hover:text-white/80"
                        : "text-white/35 hover:bg-white/4 hover:text-white/50"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 transition-all duration-200 ${
                      isActive
                        ? "bg-white text-primary-dark"
                        : isCompleted
                          ? "border border-white/40 text-white/70"
                          : "border border-white/15 text-white/30"
                    }`}
                  >
                    {isCompleted ? "✓" : step.id}
                  </span>
                  <span className="truncate">{step.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/8 text-[10px] text-white/25 tracking-wider">
        MVP v0.1.0
      </div>
    </aside>
  );
}
