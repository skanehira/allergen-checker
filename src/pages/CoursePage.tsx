import { useState } from "react";
import { recipes as allRecipes, courses as initialCourses } from "../data/mock";
import type { Recipe, Course } from "../data/mock";

type View = "list" | "detail" | "create";

export function CoursePage() {
  const [view, setView] = useState<View>("list");
  const [courseList, setCourseList] = useState<Course[]>(initialCourses);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");

  const selectedCourse = courseList.find((c) => c.id === selectedId) ?? null;

  const courseDishIds = new Set((selectedCourse?.dishes ?? []).map((d) => d.id));
  const availableRecipes = allRecipes.filter(
    (r) => !courseDishIds.has(r.id) && (search === "" || r.name.includes(search)),
  );

  function openDetail(id: number) {
    setSelectedId(id);
    setSearch("");
    setView("detail");
  }

  function addRecipe(recipe: Recipe) {
    if (!selectedId) return;
    setCourseList((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, dishes: [...c.dishes, recipe] } : c)),
    );
  }

  function removeRecipe(recipeId: number) {
    if (!selectedId) return;
    setCourseList((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, dishes: c.dishes.filter((d) => d.id !== recipeId) } : c,
      ),
    );
  }

  function moveRecipe(recipeId: number, direction: "up" | "down") {
    if (!selectedId) return;
    setCourseList((prev) =>
      prev.map((c) => {
        if (c.id !== selectedId) return c;
        const dishes = [...c.dishes];
        const idx = dishes.findIndex((d) => d.id === recipeId);
        if (idx < 0) return c;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= dishes.length) return c;
        [dishes[idx], dishes[swapIdx]] = [dishes[swapIdx], dishes[idx]];
        return { ...c, dishes };
      }),
    );
  }

  function createCourse() {
    if (!newName.trim()) return;
    const newCourse: Course = {
      id: Math.max(...courseList.map((c) => c.id)) + 1,
      name: newName.trim(),
      dishes: [],
    };
    setCourseList((prev) => [...prev, newCourse]);
    setNewName("");
    setSelectedId(newCourse.id);
    setSearch("");
    setView("detail");
  }

  // ─── List View ───
  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-medium text-text-secondary">コース一覧</h3>
          <button
            onClick={() => {
              setNewName("");
              setView("create");
            }}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
          >
            + 新規作成
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseList.map((course) => (
            <button
              key={course.id}
              onClick={() => openDetail(course.id)}
              className="bg-bg-card border border-border rounded-xl p-5 text-left hover:border-primary/40 hover:shadow-elevated transition-all cursor-pointer group"
            >
              <h4 className="font-display font-medium text-base group-hover:text-primary transition-colors mb-3">
                {course.name}
              </h4>
              <p className="text-sm text-text-muted">
                料理数:{" "}
                <span className="font-medium text-text-secondary">{course.dishes.length}</span> 品
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {course.dishes.slice(0, 3).map((dish) => (
                  <span
                    key={dish.id}
                    className="text-[11px] px-1.5 py-0.5 bg-bg-cream border border-border-light rounded text-text-muted"
                  >
                    {dish.name}
                  </span>
                ))}
                {course.dishes.length > 3 && (
                  <span className="text-[11px] px-1.5 py-0.5 text-text-muted">
                    +{course.dishes.length - 3}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Create View ───
  if (view === "create") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setView("list")}
          className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer"
        >
          ← 一覧に戻る
        </button>

        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-card max-w-lg">
          <h3 className="font-display text-base font-medium text-text-secondary mb-4">
            新規コース作成
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">コース名</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例: 3月特別懐石コース"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-card placeholder:text-text-muted/50 focus:border-primary/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") createCourse();
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setView("list")}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                onClick={createCourse}
                disabled={!newName.trim()}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                作成してレシピを追加
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Detail View ───
  return (
    <div className="space-y-6">
      <button
        onClick={() => setView("list")}
        className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer"
      >
        ← 一覧に戻る
      </button>

      {/* Course header */}
      <div className="bg-bg-card border border-border rounded-lg px-5 py-3 flex items-center gap-4">
        <span className="text-sm text-text-secondary">コース:</span>
        <span className="text-sm font-medium">{selectedCourse?.name}</span>
        <span className="text-xs text-text-muted bg-bg-cream border border-border-light rounded px-2 py-0.5">
          {selectedCourse?.dishes.length ?? 0} 品
        </span>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-2 gap-5">
        {/* Left: Available Recipes */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-border bg-bg-cream/40">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              利用可能なレシピ
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
            {availableRecipes.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-text-muted">該当なし</li>
            )}
            {availableRecipes.map((recipe) => (
              <li
                key={recipe.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-bg-cream/30 transition-colors"
              >
                <div>
                  <span className="text-sm">{recipe.name}</span>
                  <span className="text-[11px] text-text-muted ml-2">
                    {recipe.linkedIngredients.length}食材
                  </span>
                </div>
                <button
                  onClick={() => addRecipe(recipe)}
                  className="text-xs text-primary hover:text-primary-dark font-medium cursor-pointer"
                >
                  追加 →
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Course Dishes */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-card">
          <div className="px-4 py-3 border-b border-border bg-bg-cream/40">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              コース内レシピ
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              {selectedCourse?.dishes.length ?? 0} 品
            </p>
          </div>
          <ul className="divide-y divide-border-light max-h-80 overflow-y-auto">
            {(selectedCourse?.dishes ?? []).map((dish, idx) => (
              <li
                key={dish.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-bg-cream/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted tabular-nums w-5 text-right">
                    {idx + 1}.
                  </span>
                  <span className="text-sm">{dish.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveRecipe(dish.id, "up")}
                    disabled={idx === 0}
                    className="px-1.5 py-0.5 text-xs text-text-muted hover:text-text-secondary cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveRecipe(dish.id, "down")}
                    disabled={idx === (selectedCourse?.dishes.length ?? 0) - 1}
                    className="px-1.5 py-0.5 text-xs text-text-muted hover:text-text-secondary cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeRecipe(dish.id)}
                    className="text-xs text-ng/70 hover:text-ng font-medium cursor-pointer ml-2"
                  >
                    × 除外
                  </button>
                </div>
              </li>
            ))}
            {(selectedCourse?.dishes.length ?? 0) === 0 && (
              <li className="px-4 py-8 text-center text-sm text-text-muted">
                左のリストからレシピを追加してください
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
