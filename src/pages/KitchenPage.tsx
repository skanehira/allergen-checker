import { useState } from "react";
import { useAssignments } from "../hooks/useAssignments";
import { useCustomers } from "../hooks/useCustomers";
import { useCourses } from "../hooks/useCourses";
import { useRecipes } from "../hooks/useRecipes";
import { resolveCustomizedDishes, customizationLabel } from "../utils/resolveCustomizedDishes";

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function KitchenPage() {
  const [assignments] = useAssignments();
  const [customers] = useCustomers();
  const [courseList] = useCourses();
  const [allRecipes] = useRecipes();

  const today = new Date().toISOString().slice(0, 10);
  const [filterDate, setFilterDate] = useState(today);

  const sharedAssignments = assignments.filter(
    (a) => a.status === "厨房共有済" && (!filterDate || a.date === filterDate),
  );

  return (
    <div className="space-y-4 print:space-y-6">
      {/* フィルタ＋印刷ボタン（印刷時は非表示） */}
      <div className="flex items-center justify-between print:hidden">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          日付:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-lg text-sm bg-bg-card focus:border-primary/50 focus:shadow-card outline-none"
          />
        </label>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
        >
          印刷
        </button>
      </div>

      {/* 印刷用ヘッダー */}
      <div className="hidden print:block text-center mb-4">
        <h2 className="text-lg font-bold">厨房連携シート</h2>
        <p className="text-sm text-text-muted">{filterDate}</p>
      </div>

      {sharedAssignments.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl px-6 py-12 text-center text-text-muted text-sm print:border-none">
          {filterDate
            ? `${formatDateShort(filterDate)} の厨房共有済データはありません`
            : "厨房共有済のデータはありません"}
        </div>
      ) : (
        <div className="space-y-4 print:space-y-6">
          {sharedAssignments.map((assignment) => {
            const customer = customers.find((c) => c.id === assignment.customerId);
            const course = courseList.find((c) => c.id === assignment.courseId);
            if (!customer || !course) return null;

            const resolvedDishes = resolveCustomizedDishes(
              course.dishIds,
              allRecipes,
              assignment.customizations,
            );
            const activeDishes = resolvedDishes.filter((d) => !d.isRemoved);

            return (
              <div
                key={assignment.id}
                className="bg-bg-card border border-border rounded-xl shadow-card overflow-hidden print:shadow-none print:break-inside-avoid print:border-2 print:border-text"
              >
                {/* 顧客情報ヘッダー */}
                <div className="px-5 py-4 bg-primary-dark text-white print:bg-white print:text-text print:border-b-2 print:border-text">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-display text-lg font-medium print:text-xl print:font-bold">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-white/70 print:text-text-secondary">
                        {customer.roomName} / {course.name} / {formatDateShort(assignment.date)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {customer.allergens.map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 bg-white/20 text-white border border-white/30 rounded text-xs font-semibold print:bg-ng-bg print:text-ng print:border-ng-border"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  {customer.condition && (
                    <p className="mt-1 text-xs text-white/60 print:text-text-muted">
                      条件: {customer.condition} / コンタミ: {customer.contamination}
                    </p>
                  )}
                </div>

                {/* 料理リスト */}
                <div className="divide-y divide-border-light">
                  {activeDishes.map(({ recipe, customization, isCustomized }, idx) => (
                    <div
                      key={`${recipe.id}-${idx}`}
                      className={`px-5 py-3 ${isCustomized ? "bg-caution-bg/30 print:bg-gray-100" : ""}`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-text-muted text-sm font-mono">{idx + 1}.</span>
                        {isCustomized && <span className="text-sm font-bold print:text-lg">★</span>}
                        <span className={`text-sm font-medium ${isCustomized ? "font-bold" : ""}`}>
                          {recipe.name}
                        </span>
                        {isCustomized && customization && (
                          <span className="px-2 py-0.5 bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe] rounded text-[11px] font-semibold print:bg-gray-200 print:text-text print:border-text">
                            {customizationLabel(customization.action)}
                          </span>
                        )}
                      </div>

                      {/* カスタマイズ詳細 */}
                      {customization?.action === "replace" && (
                        <p className="ml-8 mt-1 text-xs text-text-secondary">
                          ※ 元の料理から差し替え
                        </p>
                      )}
                      {customization?.action === "modify" && customization.customIngredients && (
                        <div className="ml-8 mt-1">
                          <p className="text-xs text-text-muted mb-1">変更後の食材:</p>
                          <div className="flex flex-wrap gap-1">
                            {customization.customIngredients.map((ing, i) => (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded text-xs border ${
                                  ing.isModified
                                    ? "bg-caution-bg text-caution border-caution-border font-bold print:font-bold"
                                    : "bg-bg-cream text-text-secondary border-border-light"
                                }`}
                              >
                                {ing.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {customization?.note && (
                        <p className="ml-8 mt-1 text-xs text-text-secondary italic">
                          メモ: {customization.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* 除外された料理 */}
                {resolvedDishes.some((d) => d.isRemoved) && (
                  <div className="px-5 py-2 bg-bg-cream/50 border-t border-border-light">
                    <p className="text-xs text-text-muted">
                      除外:{" "}
                      {resolvedDishes
                        .filter((d) => d.isRemoved)
                        .map((d) => d.recipe.name)
                        .join(", ")}
                    </p>
                  </div>
                )}

                {/* 厨房メモ */}
                {assignment.kitchenNote && (
                  <div className="px-5 py-3 bg-caution-bg/20 border-t border-border-light">
                    <p className="text-sm">
                      <span className="font-semibold text-text-secondary">厨房メモ:</span>{" "}
                      {assignment.kitchenNote}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
