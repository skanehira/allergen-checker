import { useState } from "react";
import { customers, courses, allergen28Items } from "../data/mock";
import type { Ingredient, Recipe, Judgment } from "../data/mock";
import { StatusBadge } from "../components/StatusBadge";
import { SearchableSelect } from "../components/SearchableSelect";
import { Modal } from "../components/Modal";

type IngredientCheckResult = {
  judgment: Judgment;
  matchedAllergens: string[];
};

type DishCheckResult = {
  judgment: Judgment;
  matchedAllergens: string[];
  hasUnknown: boolean;
};

function checkIngredient(
  ingredient: Ingredient,
  customerAllergens: string[],
): IngredientCheckResult {
  const matchedAllergens = ingredient.allergens.filter((a) => customerAllergens.includes(a));
  let judgment: Judgment;
  if (ingredient.allergenUnknown) {
    judgment = matchedAllergens.length > 0 ? "NG" : "要確認";
  } else {
    judgment = matchedAllergens.length > 0 ? "NG" : "OK";
  }
  return { judgment, matchedAllergens };
}

function checkDish(recipe: Recipe, customerAllergens: string[]): DishCheckResult {
  const results = recipe.linkedIngredients.map((i) => checkIngredient(i, customerAllergens));
  const allMatched = [...new Set(results.flatMap((r) => r.matchedAllergens))];
  const hasUnknown = recipe.linkedIngredients.some((i) => i.allergenUnknown);
  const judgments = results.map((r) => r.judgment);
  let judgment: Judgment;
  if (judgments.includes("NG")) judgment = "NG";
  else if (judgments.includes("要確認")) judgment = "要確認";
  else judgment = "OK";
  return { judgment, matchedAllergens: allMatched, hasUnknown };
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
  const [allergenListOpen, setAllergenListOpen] = useState(false);

  const mandatoryItems = allergen28Items.filter((a) => a.category === "義務表示");
  const recommendedItems = allergen28Items.filter((a) => a.category === "推奨表示");

  const customer = customers.find((c) => c.id === selectedCustomerId)!;
  const course = courses.find((c) => c.id === selectedCourseId)!;

  const dishResults = course.dishes.map((dish) => {
    const result = checkDish(dish, customer.allergens);
    return { dish, ...result };
  });

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
          <button
            onClick={() => setAllergenListOpen(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            アレルゲン一覧
          </button>
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
        {dishResults.map(({ dish, judgment, matchedAllergens }) => {
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
                  {matchedAllergens.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {matchedAllergens.map((a) => (
                        <span
                          key={a}
                          className="px-1.5 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-[11px] font-semibold"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
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
                        const ingResult = checkIngredient(ing, customer.allergens);
                        return (
                          <tr
                            key={ing.id}
                            className="border-t border-border-light hover:bg-bg-cream/20 transition-colors"
                          >
                            <td className="py-2.5 px-5 text-sm font-medium">{ing.name}</td>
                            <td className="py-2.5 px-5 text-sm text-text-secondary">
                              {ing.category}
                            </td>
                            <td className="py-2.5 px-5 text-sm">
                              {ing.allergens.length > 0 ? (
                                <span className="flex flex-wrap gap-1 items-center">
                                  {ing.allergens.map((a) =>
                                    ingResult.matchedAllergens.includes(a) ? (
                                      <span
                                        key={a}
                                        className="px-1.5 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-[11px] font-semibold"
                                      >
                                        {a}
                                      </span>
                                    ) : (
                                      <span key={a} className="text-text-secondary">
                                        {a}
                                      </span>
                                    ),
                                  )}
                                  {ing.allergenUnknown && (
                                    <span className="px-1.5 py-0.5 bg-caution-bg text-caution border border-caution-border rounded text-[11px] font-semibold">
                                      不明
                                    </span>
                                  )}
                                </span>
                              ) : ing.allergenUnknown ? (
                                <span className="px-1.5 py-0.5 bg-caution-bg text-caution border border-caution-border rounded text-[11px] font-semibold">
                                  不明
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="py-2.5 px-5 text-center">
                              <StatusBadge value={ingResult.judgment} />
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

      <Modal
        open={allergenListOpen}
        onClose={() => setAllergenListOpen(false)}
        title="特定原材料28品目"
      >
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-text mb-2">特定原材料 8品目（義務表示）</h4>
            <div className="flex flex-wrap gap-2">
              {mandatoryItems.map((item) => (
                <span
                  key={item.name}
                  className="px-3 py-1.5 bg-ng-bg text-ng border border-ng-border rounded-lg text-sm font-semibold"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text mb-2">
              特定原材料に準ずるもの 20品目（推奨表示）
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendedItems.map((item) => (
                <span
                  key={item.name}
                  className="px-3 py-1.5 bg-caution-bg text-caution border border-caution-border rounded-lg text-sm font-semibold"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
