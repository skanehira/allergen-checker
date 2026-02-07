import { useState } from "react";
import { guest, matchResults } from "../data/mock";
import type { Judgment } from "../data/mock";
import { StatusBadge } from "../components/StatusBadge";

function judgmentIcon(j: Judgment) {
  switch (j) {
    case "NG":
      return "✕";
    case "要確認":
      return "△";
    case "OK":
      return "○";
  }
}

export function MatchingPage() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const counts = {
    NG: matchResults.filter((r) => r.judgment === "NG").length,
    要確認: matchResults.filter((r) => r.judgment === "要確認").length,
    OK: matchResults.filter((r) => r.judgment === "OK").length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Guest info */}
      <div className="bg-bg-card border border-border rounded-xl px-6 py-4 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">対象顧客</p>
            <p className="font-display text-lg font-medium">{guest.name}</p>
          </div>
          <div className="flex gap-5 text-sm">
            <div>
              <p className="text-[11px] text-text-muted mb-0.5">NGアレルゲン</p>
              <div className="flex gap-1.5">
                {guest.allergens.map((a) => (
                  <span
                    key={a}
                    className="px-2 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-xs font-semibold"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-text-muted mb-0.5">条件</p>
              <p className="font-medium text-sm">{guest.condition}</p>
            </div>
            <div>
              <p className="text-[11px] text-text-muted mb-0.5">コンタミ</p>
              <p className="font-medium text-sm">{guest.contamination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3">
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

      {/* Results */}
      <div className="bg-bg-card rounded-xl border border-border overflow-hidden shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-cream/40">
              <th className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left w-8"></th>
              <th className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left">
                料理名
              </th>
              <th className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center w-24">
                判定
              </th>
              <th className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left">
                理由
              </th>
              <th className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center w-20">
                詳細
              </th>
            </tr>
          </thead>
          <tbody>
            {matchResults.map((row) => {
              const isOpen = expanded.has(row.id);
              return (
                <tr key={row.id} className="border-b border-border-light last:border-0 group">
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-sm font-bold ${
                        row.judgment === "NG"
                          ? "text-ng"
                          : row.judgment === "要確認"
                            ? "text-caution"
                            : "text-ok"
                      }`}
                    >
                      {judgmentIcon(row.judgment)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{row.dish}</td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge value={row.judgment} />
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {row.reason}
                    {isOpen && (
                      <ul className="mt-2 space-y-1 animate-fade-in">
                        {row.details.map((d, i) => (
                          <li
                            key={i}
                            className="text-xs text-text-muted pl-3 border-l-2 border-border"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggle(row.id)}
                      className="text-xs text-primary hover:text-primary-dark font-medium cursor-pointer"
                    >
                      {isOpen ? "閉じる" : "展開"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-5 py-2.5 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer">
          再突合
        </button>
      </div>
    </div>
  );
}
