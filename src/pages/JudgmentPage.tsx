import { useState } from "react";
import { guest, judgmentRows as initialJudgment, pendingRows } from "../data/mock";
import type { JudgmentRow } from "../data/mock";
import { StatusBadge } from "../components/StatusBadge";

export function JudgmentPage() {
  const [rows, setRows] = useState<JudgmentRow[]>(initialJudgment);

  function approve(id: number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, approval: "承認済" as const } : r)));
  }
  function revoke(id: number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, approval: "未承認" as const } : r)));
  }

  const allApproved = rows.every((r) => r.approval === "承認済");

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Guest */}
      <div className="bg-bg-card border border-border rounded-lg px-5 py-3 flex items-center gap-4 text-sm shadow-card">
        <span className="text-text-muted">対象顧客:</span>
        <span className="font-display font-medium text-base">{guest.name}</span>
        <div className="flex gap-1.5 ml-2">
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

      {/* Judgment table */}
      <section>
        <h3 className="font-display text-base font-medium text-text-secondary mb-4">判定確定</h3>
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-cream/40">
                {["料理名", "判定", "理由", "承認", "操作"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border-light last:border-0 hover:bg-bg-cream/30 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium">{row.dish}</td>
                  <td className="py-3 px-4">
                    <StatusBadge value={row.judgment} />
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{row.reason}</td>
                  <td className="py-3 px-4">
                    <StatusBadge value={row.approval} />
                  </td>
                  <td className="py-3 px-4">
                    {row.approval === "未承認" ? (
                      <button
                        onClick={() => approve(row.id)}
                        className="text-xs font-medium text-ok hover:text-ok/80 cursor-pointer"
                      >
                        承認
                      </button>
                    ) : (
                      <button
                        onClick={() => revoke(row.id)}
                        className="text-xs font-medium text-text-muted hover:text-ng cursor-pointer"
                      >
                        取消
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pending items */}
      <section>
        <h3 className="font-display text-base font-medium text-text-secondary mb-4">
          要確認一覧
          <span className="ml-2 text-xs font-normal text-caution">({pendingRows.length}件)</span>
        </h3>
        <div className="bg-bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-cream/40">
                {["#", "項目", "理由", "担当", "期限", "状態"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border-light last:border-0 hover:bg-bg-cream/30 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-text-muted tabular-nums">{row.id}</td>
                  <td className="py-3 px-4 text-sm font-medium">{row.item}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{row.reason}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{row.assignee}</td>
                  <td className="py-3 px-4 text-sm text-ng font-medium">{row.deadline}</td>
                  <td className="py-3 px-4">
                    <StatusBadge value={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-5 py-2.5 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer">
          差し戻し
        </button>
        <button className="px-5 py-2.5 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer">
          CSV出力
        </button>
        <button
          className="px-5 py-2.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!allApproved}
        >
          判定確定して保存
        </button>
      </div>
    </div>
  );
}
