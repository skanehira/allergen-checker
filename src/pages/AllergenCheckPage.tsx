import { useState } from "react";
import { allergen28Items } from "../data/mock";
import type { Course, Ingredient, Judgment, Recipe } from "../data/types";
import { StatusBadge } from "../components/StatusBadge";
import { SearchableSelect } from "../components/SearchableSelect";
import { Modal } from "../components/Modal";
import { useCustomAllergens } from "../hooks/useCustomAllergens";
import { useCustomers } from "../hooks/useCustomers";
import { useCourses } from "../hooks/useCourses";
import { useRecipes } from "../hooks/useRecipes";
import { checkIngredient, checkDish, judgmentIcon } from "../utils/allergenCheck";

function resolveDishes(course: Course, allRecipes: Recipe[]): Recipe[] {
  return course.dishIds
    .map((id) => allRecipes.find((r) => r.id === id))
    .filter((r): r is Recipe => r !== undefined);
}

function AllergenBadges({ allergens }: { allergens: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {allergens.map((a) => (
        <span
          key={a}
          className="px-1.5 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-[11px] font-semibold"
        >
          {a}
        </span>
      ))}
    </div>
  );
}

function IngredientAllergenCell({
  ingredient,
  customerAllergens,
}: {
  ingredient: Ingredient;
  customerAllergens: string[];
}) {
  const ingResult = checkIngredient(ingredient, customerAllergens);

  if (ingredient.allergens.length > 0) {
    return (
      <span className="flex flex-wrap gap-1 items-center">
        {ingredient.allergens.map((a) =>
          ingResult.matchedAllergens.includes(a) ? (
            <span
              key={a}
              className="px-1.5 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-[11px] font-semibold"
            >
              {a}
            </span>
          ) : (
            <span key={a} className="text-text-secondary text-xs">
              {a}
            </span>
          ),
        )}
        {ingredient.allergenUnknown && (
          <span className="px-1.5 py-0.5 bg-caution-bg text-caution border border-caution-border rounded text-[11px] font-semibold">
            不明
          </span>
        )}
      </span>
    );
  }

  if (ingredient.allergenUnknown) {
    return (
      <span className="px-1.5 py-0.5 bg-caution-bg text-caution border border-caution-border rounded text-[11px] font-semibold">
        不明
      </span>
    );
  }

  return <span className="text-text-muted text-xs">—</span>;
}

function DishAccordion({
  dish,
  judgment,
  matchedAllergens,
  isOpen,
  onToggle,
  customerAllergens,
}: {
  dish: Recipe;
  judgment: Judgment;
  matchedAllergens: string[];
  isOpen: boolean;
  onToggle: () => void;
  customerAllergens: string[];
}) {
  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-3 md:px-5 md:py-4 text-left cursor-pointer hover:bg-bg-cream/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-bold ${
              judgment === "NG" ? "text-ng" : judgment === "要確認" ? "text-caution" : "text-ok"
            }`}
          >
            {judgmentIcon(judgment)}
          </span>
          <span className="font-display font-medium text-sm">{dish.name}</span>
          {matchedAllergens.length > 0 && <AllergenBadges allergens={matchedAllergens} />}
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge value={judgment} />
          <span className="text-text-muted text-xs">{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-border animate-fade-in">
          {/* Mobile card layout */}
          <div className="md:hidden divide-y divide-border-light">
            {dish.linkedIngredients.map((ing) => {
              const ingResult = checkIngredient(ing, customerAllergens);
              return (
                <div key={ing.id} className="px-3 py-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{ing.name}</span>
                    <StatusBadge value={ingResult.judgment} />
                  </div>
                  <div className="text-xs text-text-muted">{ing.category}</div>
                  <div className="text-sm">
                    <IngredientAllergenCell
                      ingredient={ing}
                      customerAllergens={customerAllergens}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Desktop table layout */}
          <table className="w-full hidden md:table">
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
                const ingResult = checkIngredient(ing, customerAllergens);
                return (
                  <tr
                    key={ing.id}
                    className="border-t border-border-light hover:bg-bg-cream/20 transition-colors"
                  >
                    <td className="py-2.5 px-5 text-sm font-medium">{ing.name}</td>
                    <td className="py-2.5 px-5 text-sm text-text-secondary">{ing.category}</td>
                    <td className="py-2.5 px-5 text-sm">
                      <IngredientAllergenCell
                        ingredient={ing}
                        customerAllergens={customerAllergens}
                      />
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
}

export function AllergenCheckPage() {
  const [customers] = useCustomers();
  const [courseList] = useCourses();
  const [allRecipes] = useRecipes();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(customers[0]?.id ?? 0);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courseList[0]?.id ?? 0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [allergenListOpen, setAllergenListOpen] = useState(false);
  const { items: customAllergens } = useCustomAllergens();

  const mandatoryItems = allergen28Items.filter((a) => a.category === "義務表示");
  const recommendedItems = allergen28Items.filter((a) => a.category === "推奨表示");

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: c.name,
    sub: `${c.roomName} / ${c.checkInDate}`,
  }));

  const course = courseList.find((c) => c.id === selectedCourseId);
  const dishes = course ? resolveDishes(course, allRecipes) : [];

  const courseOptions = courseList.map((c) => ({
    value: c.id,
    label: c.name,
    sub: `${resolveDishes(c, allRecipes).length} 品`,
  }));

  const customer = customers.find((c) => c.id === selectedCustomerId);
  const customerAllergens = customer?.allergens ?? [];

  const dishResults = dishes.map((dish) => {
    const result = checkDish(dish, customerAllergens);
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
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 sm:items-center">
          <SearchableSelect
            label="顧客"
            options={customerOptions}
            value={selectedCustomerId}
            onChange={(v) => {
              setSelectedCustomerId(v as number);
              setExpanded(new Set());
            }}
          />
          <SearchableSelect
            label="コース"
            options={courseOptions}
            value={selectedCourseId}
            onChange={(v) => {
              setSelectedCourseId(v as number);
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

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 text-sm">
          <span className="text-text-muted">アレルゲン:</span>
          <div className="flex flex-wrap gap-1.5">
            {customerAllergens.map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-xs font-semibold"
              >
                {a}
              </span>
            ))}
          </div>
          <span className="text-text-muted ml-2">条件: {customer?.condition ?? "—"}</span>
          <span className="text-text-muted">コンタミ: {customer?.contamination ?? "—"}</span>
        </div>
      </div>

      {/* サマリーチップ */}
      <div className="flex flex-wrap gap-2 md:gap-3">
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
        {dishResults.map(({ dish, judgment, matchedAllergens }) => (
          <DishAccordion
            key={dish.id}
            dish={dish}
            judgment={judgment}
            matchedAllergens={matchedAllergens}
            isOpen={expanded.has(dish.id)}
            onToggle={() => toggle(dish.id)}
            customerAllergens={customerAllergens}
          />
        ))}
      </div>

      <Modal
        open={allergenListOpen}
        onClose={() => setAllergenListOpen(false)}
        title="アレルゲン一覧"
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
          {customAllergens.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-text mb-2">カスタムアレルゲン</h4>
              <div className="flex flex-wrap gap-2">
                {customAllergens.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 bg-bg-cream border border-border rounded-lg text-sm font-semibold"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
