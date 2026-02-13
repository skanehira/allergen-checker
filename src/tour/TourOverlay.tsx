import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  targetEl: Element | null;
  padding: number;
};

type Rect = { x: number; y: number; width: number; height: number };

export function TourOverlay({ targetEl, padding }: Props) {
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!targetEl) {
      setRect(null);
      return;
    }

    function update() {
      const r = targetEl!.getBoundingClientRect();
      setRect({
        x: r.x - padding,
        y: r.y - padding,
        width: r.width + padding * 2,
        height: r.height + padding * 2,
      });
    }

    update();

    const observer = new ResizeObserver(update);
    observer.observe(targetEl);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [targetEl, padding]);

  return createPortal(
    <div className="fixed inset-0 z-[60] pointer-events-none tour-overlay">
      <svg className="w-full h-full">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                rx="8"
                ry="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.5)"
          mask="url(#tour-mask)"
          className="pointer-events-auto"
        />
      </svg>
    </div>,
    document.body,
  );
}
