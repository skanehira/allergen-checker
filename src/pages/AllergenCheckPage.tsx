import { useState } from "react";
import { customers, courses } from "../data/mock";
import type { Ingredient, Recipe, Judgment } from "../data/mock";
import { StatusBadge } from "../components/StatusBadge";
import { SearchableSelect } from "../components/SearchableSelect";

function checkIngredient(ingredient: Ingredient, customerAllergens: string[]): Judgment {
  if (ingredient.allergenUnknown) return "要確認";
  const matched = ingredient.allergens.filter((a) => customerAllergens.includes(a));
  if (matched.length > 0) return "NG";
  return "OK";
}

function checkDish(recipe: Recipe, customerAllergens: string[]): Judgment {
  const results = recipe.linkedIngredients.map((i) => checkIngredient(i, customerAllergens));
  if (results.includes("NG")) return "NG";
  if (results.includes("要確認")) return "要確認";
  return "OK";
}

function judgmentIcon(j: Judgment) {
  switch (j) {
    case "NG":
      return "✕";
    case "要確認":
      return "△";
    case "OK":
      return "○";
  }
}

const customerOptions = customers.map((c) => ({
  value: c.id,
  label: c.name,
  sub: `${c.roomNumber} / ${c.checkInDate}`,
}));

const courseOptions = courses.map((c) => ({
  value: c.id,
  label: c.name,
  sub: `${c.dishes.length} 品`,
}));

export function AllergenCheckPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(customers[0].id);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courses[0].id);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const customer = customers.find((c) => c.id === selectedCustomerId)!;
  const course = courses.find((c) => c.id === selectedCourseId)!;

  const dishResults = course.dishes.map((dish) => ({
    dish,
    judgment: checkDish(dish, customer.allergens),
  }));

  const counts = {
    NG: dishResults.filter((r) => r.judgment === "NG").length,
    要確認: dishResults.filter((r) => r.judgment === "要確認").length,
    OK: dishResults.filter((r) => r.judgment === "OK").length,
  };

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* 選択エリア */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchableSelect
            label="顧客"
            options={customerOptions}
            value={selectedCustomerId}
            onChange={(v) => {
              setSelectedCustomerId(v);
              setExpanded(new Set());
            }}
          />
          <SearchableSelect
            label="コース"
            options={courseOptions}
            value={selectedCourseId}
            onChange={(v) => {
              setSelectedCourseId(v);
              setExpanded(new Set());
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-text-muted">アレルゲン:</span>
          <div className="flex flex-wrap gap-1.5">
            {customer.allergens.map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-xs font-semibold"
              >
                {a}
              </span>
            ))}
          </div>
          <span className="text-text-muted ml-2">条件: {customer.condition}</span>
          <span className="text-text-muted">コンタミ: {customer.contamination}</span>
        </div>
      </div>

      {/* サマリーチップ */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ng-bg border border-ng-border text-ng text-sm font-semibold">
          NG <span className="text-lg">{counts.NG}</span>件
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-caution-bg border border-caution-border text-caution text-sm font-semibold">
          要確認 <span className="text-lg">{counts.要確認}</span>件
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ok-bg border border-ok-border text-ok text-sm font-semibold">
          OK <span className="text-lg">{counts.OK}</span>件
        </div>
      </div>

      {/* 料理別アコーディオン */}
      <div className="space-y-3">
        {dishResults.map(({ dish, judgment }) => {
          const isOpen = expanded.has(dish.id);
          return (
            <div
              key={dish.id}
              className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-card"
            >
              <button
                onClick={() => toggle(dish.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-bg-cream/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold ${
                      judgment === "NG"
                        ? "text-ng"
                        : judgment === "要確認"
                          ? "text-caution"
                          : "text-ok"
                    }`}
                  >
                    {judgmentIcon(judgment)}
                  </span>
                  <span className="font-display font-medium text-sm">{dish.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge value={judgment} />
                  <span className="text-text-muted text-xs">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border animate-fade-in">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-bg-cream/40">
                        <th className="py-2.5 px-5 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left">
                          食材名
                        </th>
                        <th className="py-2.5 px-5 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left">
                          カテゴリ
                        </th>
                        <th className="py-2.5 px-5 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left">
                          含有アレルゲン
                        </th>
                        <th className="py-2.5 px-5 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center w-24">
                          判定
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dish.linkedIngredients.map((ing) => {
                        const ingJudgment = checkIngredient(ing, customer.allergens);
                        const allergenDisplay =
                          ing.allergens.length > 0
                            ? ing.allergens.join(", ") + (ing.allergenUnknown ? "(不明)" : "")
                            : "—";
                        return (
                          <tr
                            key={ing.id}
                            className="border-t border-border-light hover:bg-bg-cream/20 transition-colors"
                          >
                            <td className="py-2.5 px-5 text-sm font-medium">{ing.name}</td>
                            <td className="py-2.5 px-5 text-sm text-text-secondary">
                              {ing.category}
                            </td>
                            <td className="py-2.5 px-5 text-sm text-text-secondary">
                              {allergenDisplay}
                            </td>
                            <td className="py-2.5 px-5 text-center">
                              <StatusBadge value={ingJudgment} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
