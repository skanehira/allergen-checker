import { allergen28Items } from "../data/mock";

const mandatoryItems = allergen28Items.filter((a) => a.category === "義務表示");
const recommendedItems = allergen28Items.filter((a) => a.category === "推奨表示");

export function AllergenCheckboxGroup({
  allergens,
  customAllergens,
  onToggle,
}: {
  allergens: string[];
  customAllergens: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-text mb-2">特定原材料 8品目（義務表示）</h4>
        <div className="flex flex-wrap gap-2">
          {mandatoryItems.map((item) => (
            <label
              key={item.name}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer border transition-colors ${
                allergens.includes(item.name)
                  ? "bg-ng-bg text-ng border-ng-border"
                  : "bg-bg-cream border-border text-text-secondary hover:border-primary/30"
              }`}
            >
              <input
                type="checkbox"
                checked={allergens.includes(item.name)}
                onChange={() => onToggle(item.name)}
                className="sr-only"
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-text mb-2">
          特定原材料に準ずるもの 20品目（推奨表示）
        </h4>
        <div className="flex flex-wrap gap-2">
          {recommendedItems.map((item) => (
            <label
              key={item.name}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer border transition-colors ${
                allergens.includes(item.name)
                  ? "bg-caution-bg text-caution border-caution-border"
                  : "bg-bg-cream border-border text-text-secondary hover:border-primary/30"
              }`}
            >
              <input
                type="checkbox"
                checked={allergens.includes(item.name)}
                onChange={() => onToggle(item.name)}
                className="sr-only"
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>
      {customAllergens.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text mb-2">カスタムアレルゲン</h4>
          <div className="flex flex-wrap gap-2">
            {customAllergens.map((name) => (
              <label
                key={name}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer border transition-colors ${
                  allergens.includes(name)
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-bg-cream border-border text-text-secondary hover:border-primary/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={allergens.includes(name)}
                  onChange={() => onToggle(name)}
                  className="sr-only"
                />
                {name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
