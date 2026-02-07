import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import type { Step } from "./Sidebar";

type Props = {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: ReactNode;
};

export function Layout({ steps, currentStep, onStepChange, children }: Props) {
  const step = steps.find((s) => s.id === currentStep);
  const isFirst = currentStep === 1;
  const isLast = currentStep === steps.length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar steps={steps} currentStep={currentStep} onStepChange={onStepChange} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 bg-bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-text-muted tracking-wider mb-0.5">
              STEP {currentStep} / {steps.length}
            </p>
            <h2 className="font-display text-xl font-medium tracking-wide">{step?.label}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={() => onStepChange(currentStep - 1)}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
              >
                ← 前へ
              </button>
            )}
            {!isLast && (
              <button
                onClick={() => onStepChange(currentStep + 1)}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
              >
                次へ: {steps[currentStep]?.label} →
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div key={currentStep} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
