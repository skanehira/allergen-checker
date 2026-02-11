import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssignments } from "../hooks/useAssignments";
import { useCustomers } from "../hooks/useCustomers";
import { useCourses } from "../hooks/useCourses";
import { useRecipes } from "../hooks/useRecipes";
import { checkDish, judgmentIcon } from "../utils/allergenCheck";
import { StatusBadge } from "../components/StatusBadge";
import { SearchableSelect } from "../components/SearchableSelect";
import type { DishCustomization, CustomIngredient, Recipe } from "../data/types";

type DishEditState = {
  dishId: number;
  action: "" | "replace" | "modify" | "remove";
  replacementDishId: number;
  customIngredients: CustomIngredient[];
  note: string;
};

export function CustomizePage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useAssignments();
  const [customers] = useCustomers();
  const [courseList] = useCourses();
  const [allRecipes] = useRecipes();

  const assignment = assignments.find((a) => a.id === Number(assignmentId));
  const customer = assignment ? customers.find((c) => c.id === assignment.customerId) : null;
  const course = assignment ? courseList.find((c) => c.id === assignment.courseId) : null;

  const dishes: Recipe[] = course
    ? course.dishIds
        .map((id) => allRecipes.find((r) => r.id === id))
        .filter((r): r is Recipe => r !== undefined)
    : [];

  const [editStates, setEditStates] = useState<DishEditState[]>(() =>
    dishes.map((dish) => {
      const existing = assignment?.customizations.find((c) => c.originalDishId === dish.id);
      return {
        dishId: dish.id,
        action: existing?.action ?? "",
        replacementDishId: existing?.replacementDishId ?? 0,
        customIngredients:
          existing?.customIngredients ??
          dish.linkedIngredients.map((i) => ({ name: i.name, isModified: false })),
        note: existing?.note ?? "",
      };
    }),
  );

  const [kitchenNote, setKitchenNote] = useState(assignment?.kitchenNote ?? "");

  if (!assignment || !customer || !course) {
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

  const aid = assignment.id;
  const customerAllergens = customer.allergens;

  const recipeOptions = allRecipes.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  function updateEditState(dishId: number, update: Partial<DishEditState>) {
    setEditStates((prev) => prev.map((s) => (s.dishId === dishId ? { ...s, ...update } : s)));
  }

  function handleActionChange(dishId: number, action: DishEditState["action"]) {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;

    updateEditState(dishId, {
      action,
      replacementDishId: 0,
      customIngredients: dish.linkedIngredients.map((i) => ({ name: i.name, isModified: false })),
    });
  }

  function addIngredient(dishId: number) {
    setEditStates((prev) =>
      prev.map((s) =>
        s.dishId === dishId
          ? {
              ...s,
              customIngredients: [...s.customIngredients, { name: "", isModified: true }],
            }
          : s,
      ),
    );
  }

  function removeIngredient(dishId: number, idx: number) {
    setEditStates((prev) =>
      prev.map((s) =>
        s.dishId === dishId
          ? {
              ...s,
              customIngredients: s.customIngredients.filter((_, i) => i !== idx),
            }
          : s,
      ),
    );
  }

  function updateIngredientName(dishId: number, idx: number, name: string) {
    setEditStates((prev) =>
      prev.map((s) =>
        s.dishId === dishId
          ? {
              ...s,
              customIngredients: s.customIngredients.map((ing, i) =>
                i === idx ? { ...ing, name, isModified: true } : ing,
              ),
            }
          : s,
      ),
    );
  }

  function handleSave() {
    const customizations: DishCustomization[] = editStates
      .filter((s) => s.action !== "")
      .map((s) => ({
        originalDishId: s.dishId,
        action: s.action as DishCustomization["action"],
        replacementDishId: s.action === "replace" ? s.replacementDishId : undefined,
        customIngredients: s.action === "modify" ? s.customIngredients : undefined,
        note: s.note,
      }));

    setAssignments((prev) =>
      prev.map((a) => (a.id === aid ? { ...a, customizations, kitchenNote } : a)),
    );

    navigate(`/dashboard/${aid}`);
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/${assignment.id}`)}
          className="text-sm text-text-secondary hover:text-text transition-colors cursor-pointer"
        >
          ← 戻る
        </button>
        <h3 className="font-display text-base font-medium">
          カスタマイズ: {customer.name} / {course.name}
        </h3>
      </div>

      {/* 料理リスト */}
      <div className="space-y-4">
        {dishes.map((dish, idx) => {
          const result = checkDish(dish, customerAllergens);
          const editState = editStates[idx];
          if (!editState) return null;

          return (
            <div key={dish.id} className="bg-bg-card border border-border rounded-xl shadow-card">
              {/* 料理ヘッダー */}
              <div className="px-4 py-3 md:px-5 md:py-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm font-mono">{idx + 1}</span>
                  <span
                    className={`text-sm font-bold ${
                      result.judgment === "NG"
                        ? "text-ng"
                        : result.judgment === "要確認"
                          ? "text-caution"
                          : "text-ok"
                    }`}
                  >
                    {judgmentIcon(result.judgment)}
                  </span>
                  <span className="font-display font-medium text-sm">{dish.name}</span>
                  <StatusBadge value={result.judgment} />
                </div>
                <select
                  value={editState.action}
                  onChange={(e) =>
                    handleActionChange(dish.id, e.target.value as DishEditState["action"])
                  }
                  className="px-3 py-1.5 border border-border rounded-lg text-sm bg-bg-card focus:border-primary/50 focus:shadow-card outline-none cursor-pointer"
                >
                  <option value="">対応なし</option>
                  <option value="replace">差し替え</option>
                  <option value="modify">食材変更</option>
                  <option value="remove">除外</option>
                </select>
              </div>

              {/* アクション別コンテンツ */}
              {editState.action === "replace" && (
                <div className="px-4 py-3 md:px-5 border-t border-border-light bg-bg-cream/20">
                  <p className="text-xs text-text-muted mb-2">差し替え先レシピ:</p>
                  <SearchableSelect
                    options={recipeOptions.filter((r) => r.value !== dish.id)}
                    value={editState.replacementDishId}
                    onChange={(v) => updateEditState(dish.id, { replacementDishId: v as number })}
                  />
                </div>
              )}

              {editState.action === "modify" && (
                <div className="px-4 py-3 md:px-5 border-t border-border-light bg-bg-cream/20 space-y-2">
                  <p className="text-xs text-text-muted">食材リスト（編集可能）:</p>
                  {editState.customIngredients.map((ing, ingIdx) => (
                    <div key={ingIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredientName(dish.id, ingIdx, e.target.value)}
                        className={`flex-1 px-3 py-1.5 border rounded-lg text-sm bg-bg-card outline-none ${
                          ing.isModified ? "border-primary/50 font-semibold" : "border-border"
                        } focus:border-primary/50 focus:shadow-card`}
                      />
                      <button
                        onClick={() => removeIngredient(dish.id, ingIdx)}
                        className="text-ng hover:text-ng/80 text-sm cursor-pointer px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addIngredient(dish.id)}
                    className="text-sm text-primary hover:text-primary-light transition-colors cursor-pointer"
                  >
                    + 食材を追加
                  </button>
                </div>
              )}

              {editState.action === "remove" && (
                <div className="px-4 py-3 md:px-5 border-t border-border-light bg-ng-bg/30">
                  <p className="text-sm text-text-muted">この料理はコースから除外されます</p>
                </div>
              )}

              {/* メモ */}
              {editState.action !== "" && (
                <div className="px-4 py-3 md:px-5 border-t border-border-light">
                  <input
                    type="text"
                    placeholder="メモ（厨房向け）"
                    value={editState.note}
                    onChange={(e) => updateEditState(dish.id, { note: e.target.value })}
                    className="w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-bg-card focus:border-primary/50 focus:shadow-card outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 厨房メモ */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card">
        <label className="block">
          <span className="text-sm font-medium text-text-secondary mb-2 block">
            厨房メモ（全体）
          </span>
          <textarea
            value={kitchenNote}
            onChange={(e) => setKitchenNote(e.target.value)}
            placeholder="厨房への全体的な指示・メモ"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg-card focus:border-primary/50 focus:shadow-card outline-none resize-none"
          />
        </label>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate(`/dashboard/${assignment.id}`)}
          className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
        >
          保存
        </button>
      </div>
    </div>
  );
}
