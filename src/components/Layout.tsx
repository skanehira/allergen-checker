import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import type { Step } from "./Sidebar";

type Props = {
  steps: Step[];
};

export function Layout({ steps }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = steps.findIndex((s) => s.path === location.pathname);
  const currentStep = currentIndex >= 0 ? steps[currentIndex] : steps[0];
  const stepNumber = currentIndex >= 0 ? currentIndex + 1 : 1;
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === steps.length - 1;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar steps={steps} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 bg-bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-text-muted tracking-wider mb-0.5">
              STEP {stepNumber} / {steps.length}
            </p>
            <h2 className="font-display text-xl font-medium tracking-wide">{currentStep.label}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={() => navigate(steps[currentIndex - 1].path)}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
              >
                ← 前へ
              </button>
            )}
            {!isLast && (
              <button
                onClick={() => navigate(steps[currentIndex + 1].path)}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
              >
                次へ: {steps[currentIndex + 1]?.label} →
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div key={location.pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
