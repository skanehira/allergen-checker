import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssignments } from "../hooks/useAssignments";
import { useCustomers } from "../hooks/useCustomers";
import { useCourses } from "../hooks/useCourses";
import { useRecipes } from "../hooks/useRecipes";
import { checkIngredient, checkDish, judgmentIcon } from "../utils/allergenCheck";
import { resolveCustomizedDishes, customizationLabel } from "../utils/resolveCustomizedDishes";
import { StatusBadge } from "../components/StatusBadge";
import { SearchableSelect } from "../components/SearchableSelect";
import { Modal } from "../components/Modal";
import type {
  CustomerCourseAssignment,
  DishCustomization,
  CustomIngredient,
  Ingredient,
  Judgment,
  Recipe,
} from "../data/types";

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

function InlineEditableCell({
  value,
  originalValue,
  onChange,
  allIngredientNames,
}: {
  value: string;
  originalValue: string;
  onChange: (newName: string) => void;
  allIngredientNames: string[];
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<HTMLUListElement>(null);

  const isModified = value !== originalValue;

  const suggestions =
    editing && draft.length > 0
      ? allIngredientNames.filter(
          (n) => n !== value && n.toLowerCase().includes(draft.toLowerCase()),
        )
      : [];

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    setHighlightIdx(0);
  }, [draft]);

  function commit(name: string) {
    const trimmed = name.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    }
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={`text-left cursor-pointer hover:text-primary transition-colors ${
          isModified ? "border-l-2 border-primary pl-2 font-bold" : ""
        }`}
      >
        {value}
        {isModified && (
          <span className="ml-2 text-text-muted text-xs font-normal">← {originalValue}</span>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          // delay to allow suggestion click
          setTimeout(() => {
            if (editing) commit(draft);
          }, 150);
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;
          if (e.key === "Enter") {
            e.preventDefault();
            if (suggestions.length > 0 && highlightIdx < suggestions.length) {
              commit(suggestions[highlightIdx]);
            } else {
              commit(draft);
            }
          } else if (e.key === "Escape") {
            cancel();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIdx((prev) => Math.max(prev - 1, 0));
          }
        }}
        className="w-full px-2 py-1 border border-primary/50 rounded text-sm bg-white outline-none shadow-card"
      />
      {suggestions.length > 0 && (
        <ul
          ref={suggestRef}
          className="absolute left-0 top-full mt-1 w-full bg-bg-card border border-border rounded-lg shadow-elevated z-50 max-h-40 overflow-y-auto py-1"
        >
          {suggestions.slice(0, 8).map((name, idx) => (
            <li key={name}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(name);
                }}
                onMouseEnter={() => setHighlightIdx(idx)}
                className={`w-full text-left px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                  idx === highlightIdx ? "bg-primary/8" : "hover:bg-bg-cream/50"
                }`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DishAccordion({
  dish,
  judgment,
  matchedAllergens,
  isOpen,
  onToggle,
  customerAllergens,
  customizationBadge,
  onRemoveDish,
  onOpenReplaceModal,
  onClearReplace,
  isReplaced,
  originalDishName,
  isModified,
  excludedIngredientIds,
  onToggleIngredientExclude,
  onInlineIngredientRename,
  allIngredientNames,
  customIngredients,
  note,
  onNoteChange,
  isRemoved,
}: {
  dish: Recipe;
  judgment: Judgment;
  matchedAllergens: string[];
  isOpen: boolean;
  onToggle: () => void;
  customerAllergens: string[];
  customizationBadge?: string;
  onRemoveDish: () => void;
  onOpenReplaceModal: () => void;
  onClearReplace: () => void;
  isReplaced: boolean;
  originalDishName?: string;
  isModified: boolean;
  excludedIngredientIds: Set<number>;
  onToggleIngredientExclude: (ingredientId: number) => void;
  onInlineIngredientRename: (ingIdx: number, newName: string) => void;
  allIngredientNames: string[];
  customIngredients?: CustomIngredient[];
  note: string;
  onNoteChange: (note: string) => void;
  isRemoved: boolean;
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
          {excludedIngredientIds.size > 0 && !customizationBadge && (
            <span className="px-2 py-0.5 bg-[#fef3c7] text-[#92400e] border border-[#fcd34d] rounded text-[11px] font-semibold">
              食材除外あり
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
          {/* ツールバー */}
          <div className="px-3 py-3 md:px-5 md:py-3 bg-bg-cream/20 border-b border-border-light flex items-center gap-2 flex-wrap">
            {isReplaced ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-text-muted">差し替え元:</span>
                <span className="text-sm font-medium">{originalDishName}</span>
                <button
                  onClick={onOpenReplaceModal}
                  className="px-2 py-1 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  変更
                </button>
                <button
                  onClick={onClearReplace}
                  className="px-2 py-1 text-xs text-ng border border-ng/30 rounded-lg hover:bg-ng/5 transition-colors cursor-pointer"
                >
                  解除
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onOpenReplaceModal}
                  className="px-3 py-1.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  差し替え
                </button>
                {!isRemoved && (
                  <button
                    onClick={onRemoveDish}
                    className="px-3 py-1.5 text-xs bg-ng/10 text-ng border border-ng/20 rounded-lg hover:bg-ng/20 transition-colors cursor-pointer"
                  >
                    除外
                  </button>
                )}
              </>
            )}
          </div>

          {/* メモ（差し替え済 or 食材変更時のみ） */}
          {(isReplaced || isModified) && (
            <div className="px-3 py-3 md:px-5 border-b border-border-light">
              <input
                type="text"
                placeholder="メモ（厨房向け）"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                className="w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-bg-card focus:border-primary/50 focus:shadow-card outline-none"
              />
            </div>
          )}

          {/* 食材テーブル */}
          <>
            {/* Mobile card layout */}
            <div className="md:hidden divide-y divide-border-light">
              {dish.linkedIngredients.map((ing, ingIdx) => {
                const ingResult = checkIngredient(ing, customerAllergens);
                const isExcluded = excludedIngredientIds.has(ing.id);
                const customIng = customIngredients?.[ingIdx];
                const ingDisplayName = customIng?.name ?? ing.name;
                const ingIsModified = customIng?.isModified ?? false;
                return (
                  <div
                    key={ing.id}
                    className={`px-3 py-3 space-y-1.5 ${isExcluded ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!isExcluded}
                          onChange={() => onToggleIngredientExclude(ing.id)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                        />
                        <span
                          className={`text-sm ${isExcluded ? "line-through text-text-muted" : ""} ${ingIsModified ? "border-l-2 border-primary pl-2 font-bold" : "font-medium"}`}
                        >
                          <InlineEditableCell
                            value={ingDisplayName}
                            originalValue={ing.name}
                            onChange={(newName) => onInlineIngredientRename(ingIdx, newName)}
                            allIngredientNames={allIngredientNames}
                          />
                        </span>
                      </div>
                      {!isExcluded && <StatusBadge value={ingResult.judgment} />}
                      {isExcluded && <span className="text-[11px] text-text-muted">除外</span>}
                    </div>
                    <div className="text-xs text-text-muted pl-6">{ing.category}</div>
                    {!isExcluded && (
                      <div className="text-sm pl-6">
                        <IngredientAllergenCell
                          ingredient={ing}
                          customerAllergens={customerAllergens}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Desktop table layout */}
            <table className="w-full hidden md:table">
              <thead>
                <tr className="bg-bg-cream/40">
                  <th className="py-2.5 px-3 w-10" />
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
                {dish.linkedIngredients.map((ing, ingIdx) => {
                  const ingResult = checkIngredient(ing, customerAllergens);
                  const isExcluded = excludedIngredientIds.has(ing.id);
                  const customIng = customIngredients?.[ingIdx];
                  const ingDisplayName = customIng?.name ?? ing.name;
                  return (
                    <tr
                      key={ing.id}
                      className={`border-t border-border-light transition-colors ${
                        isExcluded ? "opacity-50" : "hover:bg-bg-cream/20"
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={!isExcluded}
                          onChange={() => onToggleIngredientExclude(ing.id)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                        />
                      </td>
                      <td
                        className={`py-2.5 px-5 text-sm ${isExcluded ? "line-through text-text-muted" : ""}`}
                      >
                        <InlineEditableCell
                          value={ingDisplayName}
                          originalValue={ing.name}
                          onChange={(newName) => onInlineIngredientRename(ingIdx, newName)}
                          allIngredientNames={allIngredientNames}
                        />
                      </td>
                      <td className="py-2.5 px-5 text-sm text-text-secondary">{ing.category}</td>
                      <td className="py-2.5 px-5 text-sm">
                        {isExcluded ? (
                          <span className="text-text-muted text-xs">—</span>
                        ) : (
                          <IngredientAllergenCell
                            ingredient={ing}
                            customerAllergens={customerAllergens}
                          />
                        )}
                      </td>
                      <td className="py-2.5 px-5 text-center">
                        {isExcluded ? (
                          <span className="text-[11px] text-text-muted">除外</span>
                        ) : (
                          <StatusBadge value={ingResult.judgment} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
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
  const [editingCourse, setEditingCourse] = useState(false);

  // 差し替えモーダル用state
  const [replaceModalDishId, setReplaceModalDishId] = useState<number | null>(null);
  const [replaceModalRecipeId, setReplaceModalRecipeId] = useState<number>(0);
  const [replaceModalNote, setReplaceModalNote] = useState<string>("");

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

  const dishResults = activeDishes.map(
    ({ recipe, customization, isCustomized, excludedIngredientIds }) => {
      const result = checkDish(recipe, customerAllergens, excludedIngredientIds);
      return { recipe, ...result, customization, isCustomized, excludedIngredientIds };
    },
  );

  const counts = {
    NG: dishResults.filter((r) => r.judgment === "NG").length,
    要確認: dishResults.filter((r) => r.judgment === "要確認").length,
    OK: dishResults.filter((r) => r.judgment === "OK").length,
  };

  // 全レシピからユニーク食材名を収集
  const allIngredientNames = [
    ...new Set(allRecipes.flatMap((r) => r.linkedIngredients.map((i) => i.name))),
  ];

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const aid = assignment.id;
  const customizations = assignment.customizations;

  const currentCourseId = assignment.courseId;

  function handleCourseChange(newCourseId: number) {
    if (newCourseId === currentCourseId) {
      setEditingCourse(false);
      return;
    }
    const hasCustomizations = customizations.length > 0;
    if (
      hasCustomizations &&
      !window.confirm(
        "コースを変更すると、料理のカスタマイズ（差し替え・除外など）がリセットされます。よろしいですか？",
      )
    ) {
      return;
    }
    setAssignments((prev) =>
      prev.map((a) => (a.id === aid ? { ...a, courseId: newCourseId, customizations: [] } : a)),
    );
    setEditingCourse(false);
  }

  function updateCustomization(dishId: number, changes: Partial<DishCustomization>) {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== aid) return a;
        const existing = a.customizations.find((c) => c.originalDishId === dishId);
        let newCustomizations: DishCustomization[];
        if (existing) {
          newCustomizations = a.customizations.map((c) =>
            c.originalDishId === dishId ? { ...c, ...changes } : c,
          );
        } else {
          newCustomizations = [
            ...a.customizations,
            { originalDishId: dishId, note: "", ...changes },
          ];
        }
        // 空のカスタマイズを除去
        newCustomizations = newCustomizations.filter(
          (c) =>
            c.action != null ||
            (c.excludedIngredientIds != null && c.excludedIngredientIds.length > 0),
        );
        return { ...a, customizations: newCustomizations };
      }),
    );
  }

  function updateKitchenNote(note: string) {
    setAssignments((prev) => prev.map((a) => (a.id === aid ? { ...a, kitchenNote: note } : a)));
  }

  function updateStatus(status: CustomerCourseAssignment["status"]) {
    setAssignments((prev) => prev.map((a) => (a.id === aid ? { ...a, status } : a)));
  }

  function handleToggleIngredientExclude(dishId: number, ingredientId: number) {
    const c = customizations.find((c) => c.originalDishId === dishId);
    const current = new Set(c?.excludedIngredientIds ?? []);
    if (current.has(ingredientId)) {
      current.delete(ingredientId);
    } else {
      current.add(ingredientId);
    }
    updateCustomization(dishId, { excludedIngredientIds: [...current] });
  }

  // 除外（1クリック）
  function handleRemoveDish(dishId: number) {
    updateCustomization(dishId, { action: "remove" });
  }

  // 差し替えモーダル操作
  function openReplaceModal(dishId: number) {
    const c = customizations.find((c) => c.originalDishId === dishId);
    setReplaceModalDishId(dishId);
    setReplaceModalRecipeId(c?.replacementDishId ?? 0);
    setReplaceModalNote(c?.note ?? "");
  }

  function saveReplaceModal() {
    if (replaceModalDishId == null || replaceModalRecipeId === 0) return;
    updateCustomization(replaceModalDishId, {
      action: "replace",
      replacementDishId: replaceModalRecipeId,
      note: replaceModalNote,
      customIngredients: undefined,
    });
    setReplaceModalDishId(null);
  }

  function cancelReplaceModal() {
    setReplaceModalDishId(null);
  }

  // 差し替え解除
  function handleClearReplace(dishId: number) {
    const existing = customizations.find((c) => c.originalDishId === dishId);
    updateCustomization(dishId, {
      action: undefined,
      replacementDishId: undefined,
      note: "",
      excludedIngredientIds: existing?.excludedIngredientIds,
    });
  }

  // インライン食材編集（暗黙的に action: "modify" を設定）
  function handleInlineIngredientRename(dishId: number, ingIdx: number, newName: string) {
    const dish = allRecipes.find((r) => r.id === dishId);
    if (!dish) return;

    const c = customizations.find((c) => c.originalDishId === dishId);
    const currentCustomIngredients: CustomIngredient[] =
      c?.customIngredients ??
      dish.linkedIngredients.map((i) => ({ name: i.name, isModified: false }));

    const updated = currentCustomIngredients.map((ing, i) => {
      if (i !== ingIdx) return ing;
      const originalName = dish.linkedIngredients[i]?.name ?? "";
      return { name: newName, isModified: newName !== originalName };
    });

    // 全て元に戻されたかチェック
    const allReverted = updated.every((ing, i) => {
      const originalName = dish.linkedIngredients[i]?.name ?? "";
      return ing.name === originalName;
    });

    if (allReverted) {
      // action: "modify" をクリア
      const existing = customizations.find((c) => c.originalDishId === dishId);
      if (existing?.action === "modify") {
        updateCustomization(dishId, {
          action: undefined,
          customIngredients: undefined,
          note: "",
          excludedIngredientIds: existing.excludedIngredientIds,
        });
      }
    } else {
      updateCustomization(dishId, {
        action: "modify",
        customIngredients: updated,
      });
    }
  }

  const courseOptions = courseList.map((c) => ({ value: c.id, label: c.name }));
  const recipeOptions = allRecipes.map((r) => ({ value: r.id, label: r.name }));

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
              {customer?.name ?? "—"} /{" "}
              {editingCourse ? (
                <span className="inline-block align-middle w-56">
                  <SearchableSelect
                    options={courseOptions}
                    value={currentCourseId}
                    onChange={(v) => handleCourseChange(v as number)}
                  />
                </span>
              ) : (
                <button
                  onClick={() => setEditingCourse(true)}
                  className="hover:text-primary transition-colors cursor-pointer border-b border-dashed border-text-muted hover:border-primary"
                >
                  {course?.name ?? "—"}
                </button>
              )}
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
              .map((d) => {
                const origId = d.customization?.originalDishId ?? d.recipe.id;
                return (
                  <span
                    key={d.recipe.id}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-bg-card border border-border rounded-lg text-sm text-text-secondary"
                  >
                    <span className="line-through">{d.recipe.name}</span>
                    <button
                      onClick={() => updateCustomization(origId, { action: undefined })}
                      className="text-primary hover:text-primary-light text-xs cursor-pointer"
                    >
                      戻す
                    </button>
                  </span>
                );
              })}
          </div>
        </div>
      )}

      {/* 料理別アコーディオン */}
      <div className="space-y-3">
        {dishResults.map(
          ({
            recipe,
            judgment,
            matchedAllergens,
            isCustomized,
            customization,
            excludedIngredientIds,
          }) => {
            const originalDishId = customization?.originalDishId ?? recipe.id;
            const isReplaced = customization?.action === "replace";
            const isModifiedAction = customization?.action === "modify";
            // resolve the actual dish for ingredient display
            // For "replace", the recipe is already the replacement from resolveCustomizedDishes
            // For "modify", we need the original dish to get linkedIngredients
            const originalDish = allRecipes.find((r) => r.id === originalDishId);
            const ingredientSourceDish = isReplaced ? recipe : (originalDish ?? recipe);

            return (
              <DishAccordion
                key={`${recipe.id}-${originalDishId}`}
                dish={ingredientSourceDish}
                judgment={judgment}
                matchedAllergens={matchedAllergens}
                isOpen={expanded.has(originalDishId)}
                onToggle={() => toggle(originalDishId)}
                customerAllergens={customerAllergens}
                customizationBadge={
                  isCustomized && customization?.action
                    ? (customizationLabel(customization.action) ?? undefined)
                    : undefined
                }
                onRemoveDish={() => handleRemoveDish(originalDishId)}
                onOpenReplaceModal={() => openReplaceModal(originalDishId)}
                onClearReplace={() => handleClearReplace(originalDishId)}
                isReplaced={isReplaced}
                originalDishName={isReplaced ? originalDish?.name : undefined}
                isModified={isModifiedAction}
                excludedIngredientIds={new Set(excludedIngredientIds)}
                onToggleIngredientExclude={(ingredientId) =>
                  handleToggleIngredientExclude(originalDishId, ingredientId)
                }
                onInlineIngredientRename={(ingIdx, newName) =>
                  handleInlineIngredientRename(originalDishId, ingIdx, newName)
                }
                allIngredientNames={allIngredientNames}
                customIngredients={customization?.customIngredients}
                note={customization?.note ?? ""}
                onNoteChange={(note) => updateCustomization(originalDishId, { note })}
                isRemoved={false}
              />
            );
          },
        )}
      </div>

      {/* 厨房メモ（全体） */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card">
        <label className="block">
          <span className="text-sm font-medium text-text-secondary mb-2 block">
            厨房メモ（全体）
          </span>
          <textarea
            value={assignment.kitchenNote}
            onChange={(e) => updateKitchenNote(e.target.value)}
            placeholder="厨房への全体的な指示・メモ"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg-card focus:border-primary/50 focus:shadow-card outline-none resize-none"
          />
        </label>
      </div>

      {/* 差し替えモーダル */}
      <Modal
        open={replaceModalDishId != null}
        onClose={cancelReplaceModal}
        title="料理の差し替え"
        allowOverflow
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-text-muted mb-2">差し替え先レシピ:</p>
            <SearchableSelect
              options={recipeOptions.filter((r) => r.value !== replaceModalDishId)}
              value={replaceModalRecipeId}
              onChange={(v) => setReplaceModalRecipeId(v as number)}
            />
          </div>
          <div>
            <p className="text-sm text-text-muted mb-2">メモ（厨房向け）:</p>
            <input
              type="text"
              value={replaceModalNote}
              onChange={(e) => setReplaceModalNote(e.target.value)}
              placeholder="例: アレルギー対応のため差し替え"
              className="w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-bg-card focus:border-primary/50 focus:shadow-card outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={cancelReplaceModal}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg-cream/50 transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={saveReplaceModal}
              disabled={replaceModalRecipeId === 0}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
