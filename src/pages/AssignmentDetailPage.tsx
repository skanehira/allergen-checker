import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssignments } from "../hooks/useAssignments";
import { useCustomers } from "../hooks/useCustomers";
import { useCourses } from "../hooks/useCourses";
import { useRecipes } from "../hooks/useRecipes";
import { checkIngredient, checkDish, judgmentIcon } from "../utils/allergenCheck";
import { resolveCustomizedDishes, customizationLabel } from "../utils/resolveCustomizedDishes";
import { StatusBadge } from "../components/StatusBadge";
import type { Ingredient, Judgment, Recipe } from "../data/types";

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
  customizationBadge,
}: {
  dish: Recipe;
  judgment: Judgment;
  matchedAllergens: string[];
  isOpen: boolean;
  onToggle: () => void;
  customerAllergens: string[];
  customizationBadge?: string;
}) {
  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-3 md:px-5 md:py-4 text-left cursor-pointer hover:bg-bg-cream/30 transition-colors"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`text-sm font-bold ${
              judgment === "NG" ? "text-ng" : judgment === "要確認" ? "text-caution" : "text-ok"
            }`}
          >
            {judgmentIcon(judgment)}
          </span>
          <span className="font-display font-medium text-sm">{dish.name}</span>
          {customizationBadge && (
            <span className="px-2 py-0.5 bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe] rounded text-[11px] font-semibold">
              {customizationBadge}
            </span>
          )}
          {matchedAllergens.length > 0 && <AllergenBadges allergens={matchedAllergens} />}
        </div>
        <div className="flex items-center gap-3 shrink-0">
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

export function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useAssignments();
  const [customers] = useCustomers();
  const [courseList] = useCourses();
  const [allRecipes] = useRecipes();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const assignment = assignments.find((a) => a.id === Number(assignmentId));

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted mb-4">割当が見つかりません</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
        >
          ダッシュボードに戻る
        </button>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === assignment.customerId);
  const course = courseList.find((c) => c.id === assignment.courseId);
  const customerAllergens = customer?.allergens ?? [];

  const resolvedDishes = course
    ? resolveCustomizedDishes(course.dishIds, allRecipes, assignment.customizations)
    : [];

  const activeDishes = resolvedDishes.filter((d) => !d.isRemoved);

  const dishResults = activeDishes.map(({ recipe, customization, isCustomized }) => {
    const result = checkDish(recipe, customerAllergens);
    return { recipe, ...result, customization, isCustomized };
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

  const aid = assignment.id;
  function updateStatus(status: "確認済" | "厨房共有済") {
    setAssignments((prev) => prev.map((a) => (a.id === aid ? { ...a, status } : a)));
  }

  return (
    <div className="space-y-6">
      {/* 戻るボタン */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-sm text-text-secondary hover:text-text transition-colors cursor-pointer"
      >
        ← ダッシュボードに戻る
      </button>

      {/* 顧客・コース情報 */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-medium">
              {customer?.name ?? "—"} / {course?.name ?? "—"}
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {customer?.roomName} / 提供日: {assignment.date}
            </p>
          </div>
          <StatusBadge value={assignment.status} />
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

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate(`/dashboard/${assignment.id}/customize`)}
          className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
        >
          カスタマイズ
        </button>
        {assignment.status === "未確認" && (
          <button
            onClick={() => updateStatus("確認済")}
            className="px-4 py-2 text-sm bg-ok text-white rounded-lg hover:opacity-90 transition-colors cursor-pointer"
          >
            確認済にする
          </button>
        )}
        {(assignment.status === "未確認" || assignment.status === "確認済") && (
          <button
            onClick={() => updateStatus("厨房共有済")}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
          >
            厨房共有
          </button>
        )}
      </div>

      {/* 除外された料理の表示 */}
      {resolvedDishes.some((d) => d.isRemoved) && (
        <div className="bg-bg-cream border border-border-light rounded-xl p-4">
          <p className="text-sm text-text-muted mb-2">除外された料理:</p>
          <div className="flex flex-wrap gap-2">
            {resolvedDishes
              .filter((d) => d.isRemoved)
              .map((d) => (
                <span
                  key={d.recipe.id}
                  className="px-3 py-1 bg-bg-card border border-border rounded-lg text-sm text-text-secondary line-through"
                >
                  {d.recipe.name}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* 料理別アコーディオン */}
      <div className="space-y-3">
        {dishResults.map(({ recipe, judgment, matchedAllergens, isCustomized, customization }) => (
          <DishAccordion
            key={`${recipe.id}-${customization?.originalDishId ?? recipe.id}`}
            dish={recipe}
            judgment={judgment}
            matchedAllergens={matchedAllergens}
            isOpen={expanded.has(customization?.originalDishId ?? recipe.id)}
            onToggle={() => toggle(customization?.originalDishId ?? recipe.id)}
            customerAllergens={customerAllergens}
            customizationBadge={
              isCustomized && customization ? customizationLabel(customization.action) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
