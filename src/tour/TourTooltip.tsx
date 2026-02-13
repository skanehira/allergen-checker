import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFloating, offset, flip, shift, arrow, autoUpdate } from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import type { TourStep } from "./types";

type Props = {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  targetEl: Element | null;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
};

export function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  targetEl,
  onNext,
  onPrev,
  onClose,
}: Props) {
  const arrowRef = useRef<HTMLDivElement>(null);
  const [floatingNode, setFloatingNode] = useState<HTMLElement | null>(null);
  const isLast = stepIndex === totalSteps - 1;
  const isFirst = stepIndex === 0;

  const placement: Placement = step.side;

  const { refs, floatingStyles, middlewareData, update } = useFloating({
    placement,
    middleware: [
      offset(16),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      arrow({ element: arrowRef }),
    ],
  });

  // floating要素のマウントを状態で追跡するコールバックref
  const floatingCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
      setFloatingNode(node);
    },
    [refs],
  );

  // targetEl をリファレンスに設定
  useEffect(() => {
    refs.setReference(targetEl);
  }, [targetEl, refs]);

  // 両方の要素が揃ったらautoUpdateを開始
  useEffect(() => {
    if (!targetEl || !floatingNode) return;
    update();
    return autoUpdate(targetEl, floatingNode, update);
  }, [targetEl, floatingNode, update]);

  // Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 中央モーダル形式（selector === null）
  if (!targetEl) {
    return createPortal(
      <div
        className="fixed inset-0 z-[61] flex items-center justify-center pointer-events-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-bg-card rounded-xl shadow-elevated border border-border p-6 max-w-sm mx-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-medium text-base">{step.title}</h4>
            <span className="text-xs text-text-muted ml-3 shrink-0">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>
          <div className="text-sm text-text-secondary mb-5 leading-relaxed">{step.content}</div>
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            >
              スキップ
            </button>
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={onPrev}
                  className="px-3 py-1.5 text-xs border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
                >
                  ← 前へ
                </button>
              )}
              <button
                onClick={onNext}
                className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
              >
                {isLast ? "完了" : "次へ →"}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // Arrow positioning
  const sideMap: Record<string, string> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };
  const actualSide = placement.split("-")[0];
  const arrowSide = sideMap[actualSide] ?? "top";

  return createPortal(
    <div ref={floatingCallbackRef} style={floatingStyles} className="z-[61] pointer-events-auto">
      <div className="bg-bg-card rounded-xl shadow-elevated border border-border p-5 max-w-xs relative animate-fade-in">
        {/* Arrow */}
        <div
          ref={arrowRef}
          className="absolute w-3 h-3 bg-bg-card border border-border rotate-45"
          style={{
            left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : undefined,
            top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : undefined,
            [arrowSide]: "-7px",
            borderTop: arrowSide === "bottom" || arrowSide === "right" ? "none" : undefined,
            borderRight: arrowSide === "bottom" || arrowSide === "left" ? "none" : undefined,
            borderBottom: arrowSide === "top" || arrowSide === "left" ? "none" : undefined,
            borderLeft: arrowSide === "top" || arrowSide === "right" ? "none" : undefined,
          }}
        />

        <div className="flex items-center justify-between mb-2">
          <h4 className="font-display font-medium text-sm">{step.title}</h4>
          <span className="text-[11px] text-text-muted ml-2 shrink-0">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
        <div className="text-sm text-text-secondary mb-4 leading-relaxed">{step.content}</div>
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-[11px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            スキップ
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="px-3 py-1.5 text-[11px] border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
              >
                ← 前へ
              </button>
            )}
            <button
              onClick={onNext}
              className="px-3 py-1.5 text-[11px] bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
            >
              {isLast ? "完了" : "次へ →"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
