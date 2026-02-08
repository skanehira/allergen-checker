import { useState } from "react";
import { allergen28Items } from "../data/mock";
import { useCustomAllergens } from "../hooks/useCustomAllergens";

export function CustomAllergenPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const { items: customAllergens, add, remove } = useCustomAllergens();

  const mandatoryItems = allergen28Items.filter((a) => a.category === "義務表示");
  const recommendedItems = allergen28Items.filter((a) => a.category === "推奨表示");
  const all28Names = allergen28Items.map((a) => a.name);

  function handleAdd() {
    const trimmed = input.trim();
    if (all28Names.includes(trimmed)) {
      setError("特定原材料28品目に含まれています");
      return;
    }
    const result = add(trimmed);
    if (result.ok) {
      setInput("");
      setError("");
    } else {
      setError(result.error ?? "");
    }
  }

  return (
    <div className="space-y-6">
      {/* 特定原材料28品目（読み取り専用） */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card space-y-5">
        <h3 className="font-display text-base font-semibold">特定原材料28品目</h3>
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

      {/* カスタムアレルゲン */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
        <h3 className="font-display text-base font-semibold">カスタムアレルゲン</h3>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === "Enter") handleAdd();
              }}
              placeholder="アレルゲン名を入力"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {error && <p className="text-ng text-xs mt-1">{error}</p>}
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors cursor-pointer shrink-0"
          >
            追加
          </button>
        </div>
        {customAllergens.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {customAllergens.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-cream border border-border rounded-lg text-sm font-semibold"
              >
                {name}
                <button
                  onClick={() => remove(name)}
                  className="text-text-muted hover:text-ng transition-colors cursor-pointer text-xs leading-none"
                  aria-label={`${name}を削除`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">カスタムアレルゲンはまだ登録されていません</p>
        )}
      </div>
    </div>
  );
}
