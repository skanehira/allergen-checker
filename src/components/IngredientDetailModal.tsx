import { useState } from "react";
import type { ImportedIngredient, RawMaterial } from "../data/mock";
import { allergen28Items } from "../data/mock";
import { Modal } from "./Modal";
import { StatusBadge } from "./StatusBadge";
import { AllergenChips } from "./AllergenChips";

type Props = {
  item: ImportedIngredient | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: ImportedIngredient) => void;
};

function collectAllergens(materials: RawMaterial[]): string[] {
  return [...new Set(materials.flatMap((m) => m.allergens))];
}

export function IngredientDetailModal({ item, open, onClose, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [newName, setNewName] = useState("");
  const [newAllergens, setNewAllergens] = useState<string[]>([]);

  function startEdit() {
    if (!item) return;
    setMaterials(item.rawMaterials.map((m) => ({ ...m, allergens: [...m.allergens] })));
    setEditing(true);
    setNewName("");
    setNewAllergens([]);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    if (!item) return;
    onUpdate({ ...item, rawMaterials: materials });
    setEditing(false);
  }

  function removeMaterial(idx: number) {
    setMaterials((prev) => prev.filter((_, i) => i !== idx));
  }

  function toggleMaterialAllergen(idx: number, allergen: string) {
    setMaterials((prev) =>
      prev.map((m, i) => {
        if (i !== idx) return m;
        const has = m.allergens.includes(allergen);
        return {
          ...m,
          allergens: has ? m.allergens.filter((a) => a !== allergen) : [...m.allergens, allergen],
        };
      }),
    );
  }

  function addMaterial() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setMaterials((prev) => [...prev, { name: trimmed, allergens: [...newAllergens] }]);
    setNewName("");
    setNewAllergens([]);
  }

  function toggleNewAllergen(allergen: string) {
    setNewAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen],
    );
  }

  if (!item) return null;

  const displayMaterials = editing ? materials : item.rawMaterials;
  const allAllergens = collectAllergens(displayMaterials);

  return (
    <Modal open={open} onClose={onClose} title="食材詳細">
      <div className="space-y-5">
        {/* Header info */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6 text-sm text-text-secondary">
          <span>
            食材名: <strong className="text-text">{item.name}</strong>
          </span>
          <span className="text-border hidden sm:inline">|</span>
          <span>
            出典: <strong className="text-text">{item.sourceFile}</strong>
          </span>
          <span className="text-border hidden sm:inline">|</span>
          <StatusBadge value={item.status} />
        </div>

        {/* Allergen summary */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">検出アレルゲン:</span>
          <AllergenChips allergens={allAllergens} />
        </div>

        {/* Raw materials table */}
        <div className="bg-bg-cream/50 rounded-lg border border-border-light overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-cream/60">
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-text-muted uppercase">
                  原材料名
                </th>
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-text-muted uppercase">
                  含有アレルゲン
                </th>
                {editing && (
                  <th className="py-2 px-3 text-center text-[11px] font-semibold text-text-muted uppercase w-16">
                    削除
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayMaterials.map((mat, idx) => (
                <tr
                  key={`${mat.name}-${idx}`}
                  className="border-b border-border-light last:border-0"
                >
                  <td className="py-2 px-3 font-medium">{mat.name}</td>
                  <td className="py-2 px-3">
                    {editing ? (
                      <div className="flex flex-wrap gap-1">
                        {allergen28Items.map((a) => (
                          <button
                            key={a.name}
                            type="button"
                            onClick={() => toggleMaterialAllergen(idx, a.name)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border cursor-pointer transition-colors ${
                              mat.allergens.includes(a.name)
                                ? "bg-primary text-white border-primary"
                                : "bg-bg-cream text-text-muted border-border-light hover:border-primary/30"
                            }`}
                          >
                            {a.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <AllergenChips allergens={mat.allergens} />
                    )}
                  </td>
                  {editing && (
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeMaterial(idx)}
                        className="text-xs text-ng hover:text-ng/80 font-medium cursor-pointer"
                      >
                        削除
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {displayMaterials.length === 0 && (
                <tr>
                  <td
                    colSpan={editing ? 3 : 2}
                    className="py-4 text-center text-sm text-text-muted"
                  >
                    原材料が登録されていません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add new material (edit mode) */}
        {editing && (
          <div className="space-y-3 p-4 bg-bg-cream/30 rounded-lg border border-border-light">
            <h4 className="text-xs font-semibold text-text-muted uppercase">原材料を追加</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="原材料名"
                className="flex-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-bg-card focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={addMaterial}
                disabled={!newName.trim()}
                className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                追加
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {allergen28Items.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => toggleNewAllergen(a.name)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium border cursor-pointer transition-colors ${
                    newAllergens.includes(a.name)
                      ? "bg-primary text-white border-primary"
                      : "bg-bg-cream text-text-muted border-border-light hover:border-primary/30"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
              >
                保存
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startEdit}
              className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
            >
              編集
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
