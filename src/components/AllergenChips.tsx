import { allergen28Items } from "../data/mock";

const mandatorySet = new Set(
  allergen28Items.filter((a) => a.category === "義務表示").map((a) => a.name),
);

export function AllergenChips({ allergens }: { allergens: string[] }) {
  if (allergens.length === 0) {
    return <span className="text-xs text-text-muted">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {allergens.map((a) => (
        <span
          key={a}
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
            mandatorySet.has(a)
              ? "bg-ng-bg text-ng border-ng-border"
              : "bg-caution-bg text-caution border-caution-border"
          }`}
        >
          {a}
        </span>
      ))}
    </div>
  );
}
