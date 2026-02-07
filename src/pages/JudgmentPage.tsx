import { useState } from "react";
import {
  customers,
  judgmentRowsByCustomer,
  pendingRowsByCustomer,
  matchResultsByCustomer,
} from "../data/mock";
import type { JudgmentRow, PendingRow, Judgment } from "../data/mock";
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

type View = "list" | "detail";

export function JudgmentPage() {
  const [view, setView] = useState<View>("list");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [judgmentState, setJudgmentState] = useState<Record<number, JudgmentRow[]>>(() =>
    JSON.parse(JSON.stringify(judgmentRowsByCustomer)),
  );
  const [pendingState] = useState<Record<number, PendingRow[]>>(() =>
    JSON.parse(JSON.stringify(pendingRowsByCustomer)),
  );
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function openDetail(id: number) {
    setSelectedCustomerId(id);
    setExpanded(new Set());
    setView("detail");
  }

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function approve(id: number) {
    if (!selectedCustomerId) return;
    setJudgmentState((prev) => ({
      ...prev,
      [selectedCustomerId]: (prev[selectedCustomerId] ?? []).map((r) =>
        r.id === id ? { ...r, approval: "承認済" as const } : r,
      ),
    }));
  }

  function revoke(id: number) {
    if (!selectedCustomerId) return;
    setJudgmentState((prev) => ({
      ...prev,
      [selectedCustomerId]: (prev[selectedCustomerId] ?? []).map((r) =>
        r.id === id ? { ...r, approval: "未承認" as const } : r,
      ),
    }));
  }

  // ─── List View ───
  if (view === "list") {
    return (
      <div className="space-y-6">
        <h3 className="font-display text-base font-medium text-text-secondary">顧客一覧</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => {
            const rows = judgmentState[customer.id] ?? [];
            const pending = pendingState[customer.id] ?? [];
            const approvedCount = rows.filter((r) => r.approval === "承認済").length;
            const unapprovedCount = rows.filter((r) => r.approval === "未承認").length;

            return (
              <button
                key={customer.id}
                onClick={() => openDetail(customer.id)}
                className="bg-bg-card border border-border rounded-xl p-5 text-left hover:border-primary/40 hover:shadow-elevated transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display font-medium text-base group-hover:text-primary transition-colors">
                    {customer.name}
                  </h4>
                  <span className="text-[11px] text-text-muted shrink-0 ml-2">
                    {customer.roomNumber}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {customer.allergens.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-[11px] font-semibold"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-text-muted mb-3">
                  <span>チェックイン: {customer.checkInDate}</span>
                </div>

                <div className="flex gap-2">
                  {approvedCount > 0 && (
                    <span className="px-2 py-0.5 bg-ok-bg text-ok border border-ok-border rounded text-[11px] font-semibold">
                      承認済 {approvedCount}
                    </span>
                  )}
                  {unapprovedCount > 0 && (
                    <span className="px-2 py-0.5 bg-caution-bg text-caution border border-caution-border rounded text-[11px] font-semibold">
                      未承認 {unapprovedCount}
                    </span>
                  )}
                  {pending.length > 0 && (
                    <span className="px-2 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-[11px] font-semibold">
                      要確認 {pending.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Detail View ───
  const customer = customers.find((c) => c.id === selectedCustomerId)!;
  const rows = judgmentState[selectedCustomerId!] ?? [];
  const pending = pendingState[selectedCustomerId!] ?? [];
  const matchResults = matchResultsByCustomer[selectedCustomerId!] ?? [];
  const allApproved = rows.length > 0 && rows.every((r) => r.approval === "承認済");

  const matchCounts = {
    NG: matchResults.filter((r) => r.judgment === "NG").length,
    要確認: matchResults.filter((r) => r.judgment === "要確認").length,
    OK: matchResults.filter((r) => r.judgment === "OK").length,
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => setView("list")}
        className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer"
      >
        ← 顧客一覧に戻る
      </button>

      {/* Guest */}
      <div className="bg-bg-card border border-border rounded-lg px-5 py-3 flex items-center gap-4 text-sm shadow-card">
        <span className="text-text-muted">対象顧客:</span>
        <span className="font-display font-medium text-base">{customer.name}</span>
        <div className="flex gap-1.5 ml-2">
          {customer.allergens.map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-xs font-semibold"
            >
              {a}
            </span>
          ))}
        </div>
        <span className="text-text-muted ml-auto text-xs">
          {customer.roomNumber} / {customer.checkInDate}
        </span>
      </div>

      {/* Match summary chips */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ng-bg border border-ng-border text-ng text-sm font-semibold">
          NG <span className="text-lg">{matchCounts.NG}</span>件
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-caution-bg border border-caution-border text-caution text-sm font-semibold">
          要確認 <span className="text-lg">{matchCounts.要確認}</span>件
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ok-bg border border-ok-border text-ok text-sm font-semibold">
          OK <span className="text-lg">{matchCounts.OK}</span>件
        </div>
      </div>

      {/* Match results table */}
      {matchResults.length > 0 && (
        <section>
          <h3 className="font-display text-base font-medium text-text-secondary mb-4">突合結果</h3>
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
        </section>
      )}

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
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-text-muted">
                    判定データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pending items */}
      {pending.length > 0 && (
        <section>
          <h3 className="font-display text-base font-medium text-text-secondary mb-4">
            要確認一覧
            <span className="ml-2 text-xs font-normal text-caution">({pending.length}件)</span>
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
                {pending.map((row) => (
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
      )}

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
