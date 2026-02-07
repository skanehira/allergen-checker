import { useState } from "react";
import { availableIngredients, initialLinked } from "../data/mock";
import type { Ingredient, IngredientCategory } from "../data/mock";

const categories: IngredientCategory[] = ["主食材", "調味料", "共通仕込み"];

export function RecipeLinkPage() {
  const [linked, setLinked] = useState<Ingredient[]>(initialLinked);
  const [search, setSearch] = useState("");

  const linkedIds = new Set(linked.map((i) => i.id));
  const filtered = availableIngredients.filter(
    (i) => !linkedIds.has(i.id) && (search === "" || i.name.includes(search)),
  );

  function add(item: Ingredient) {
    setLinked((prev) => [...prev, item]);
  }
  function remove(id: number) {
    setLinked((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Recipe selector */}
      <div className="bg-bg-card border border-border rounded-lg px-5 py-3 flex items-center gap-4">
        <span className="text-sm text-text-secondary">料理選択:</span>
        <span className="text-sm font-medium">銀鱈の西京焼き</span>
        <span className="text-xs text-text-muted bg-bg-cream border border-border-light rounded px-2 py-0.5">
          v2026-02
        </span>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-2 gap-5">
        {/* Left: Available */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-border bg-bg-cream/40">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              利用可能な食材・調味料
            </h4>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="検索..."
              className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-bg-card placeholder:text-text-muted/50 focus:border-primary/50"
            />
          </div>
          <ul className="divide-y divide-border-light max-h-80 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-text-muted">該当なし</li>
            )}
            {filtered.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-bg-cream/30 transition-colors"
              >
                <div>
                  <span className="text-sm">{item.name}</span>
                  <span className="text-[11px] text-text-muted ml-2">{item.category}</span>
                </div>
                <button
                  onClick={() => add(item)}
                  className="text-xs text-primary hover:text-primary-dark font-medium cursor-pointer"
                >
                  追加 →
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Linked */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-border bg-bg-cream/40">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              この料理に紐づいた項目
            </h4>
            <p className="text-xs text-text-muted mt-0.5">{linked.length} 件</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {categories.map((cat) => {
              const items = linked.filter((i) => i.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="px-4 py-2 text-[11px] font-semibold text-accent uppercase tracking-wider bg-bg-cream/30">
                    {cat}
                  </div>
                  <ul className="divide-y divide-border-light">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-bg-cream/30 transition-colors"
                      >
                        <span className="text-sm">{item.name}</span>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-xs text-ng/70 hover:text-ng font-medium cursor-pointer"
                        >
                          × 除外
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-5 py-2.5 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer">
          保存
        </button>
      </div>
    </div>
  );
}
