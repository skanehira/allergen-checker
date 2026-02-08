import { useState, useRef, useEffect } from "react";

type Option = {
  value: string | number;
  label: string;
  sub?: string;
};

type Props = {
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
};

export function SearchableSelect({ label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) => {
    if (query === "") return true;
    const q = query.toLowerCase();
    return o.label.toLowerCase().includes(q) || (o.sub?.toLowerCase().includes(q) ?? false);
  });

  useEffect(() => {
    setHighlightIdx(0);
  }, [query, open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const item = listRef.current.children[highlightIdx] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightIdx, open]);

  function select(opt: Option) {
    onChange(opt.value);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.nativeEvent.isComposing) return;
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIdx]) {
        select(filtered[highlightIdx]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  }

  const inline = label != null;

  return (
    <div
      ref={containerRef}
      className={inline ? "relative flex items-center sm:inline-flex" : "relative"}
    >
      {inline && <span className="text-text-muted text-sm mr-2 shrink-0">{label}:</span>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={open ? query : (selected?.label ?? "")}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="検索..."
          className={`border border-border rounded-lg px-3 py-1.5 pr-7 text-sm bg-white hover:border-primary/40 transition-colors ${
            inline ? "w-full sm:min-w-[200px] sm:w-auto" : "w-full"
          } ${open ? "border-primary/50 shadow-card" : ""}`}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px] pointer-events-none">
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div
          className={`absolute top-full mt-1 bg-bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden animate-fade-in ${
            inline ? "left-0 sm:right-0 sm:left-auto w-full sm:w-72" : "left-0 w-full"
          }`}
        >
          <ul ref={listRef} className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-text-muted text-center">該当なし</li>
            )}
            {filtered.map((opt, idx) => (
              <li key={opt.value}>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(opt);
                  }}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    idx === highlightIdx ? "bg-primary/8" : "hover:bg-bg-cream/50"
                  } ${opt.value === value ? "font-medium text-primary" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {opt.value === value && (
                      <span className="text-primary text-xs font-semibold">✓</span>
                    )}
                  </div>
                  {opt.sub && (
                    <span className="text-[11px] text-text-muted block mt-0.5">{opt.sub}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
