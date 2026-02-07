import { useState } from "react";
import { normalizationItems } from "../data/mock";
import type { NormalizationItem } from "../data/mock";
import { StatusBadge } from "../components/StatusBadge";
import { Modal } from "../components/Modal";

export function NormalizePage() {
  const [items, setItems] = useState<NormalizationItem[]>(normalizationItems);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  const pendingCount = items.filter((i) => i.status === "要確認").length;
  const pendingItems = items.filter((i) => i.status === "要確認");

  function confirm(id: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "確定" as const } : i)));
  }
  function revert(id: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "要確認" as const } : i)));
  }

  function sendReview() {
    setReviewOpen(false);
    setReviewSent(true);
    setTimeout(() => setReviewSent(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Meta */}
      <div className="flex items-center gap-6 text-sm text-text-secondary bg-bg-card border border-border rounded-lg px-5 py-3">
        <span>
          取込ID: <strong className="text-text">101</strong>
        </span>
        <span className="text-border">|</span>
        <span>
          出典: <strong className="text-text">規格書</strong>
        </span>
        <span className="text-border">|</span>
        <span>
          更新日: <strong className="text-text">2026-02-07</strong>
        </span>
      </div>

      {/* Summary */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-caution-bg border border-caution-border rounded-lg text-sm text-caution">
          <span className="text-base">⚠</span>
          不明・未確定: <strong>{pendingCount}件</strong>
        </div>
      )}

      {/* Success message */}
      {reviewSent && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-ok-bg border border-ok-border rounded-lg text-sm text-ok animate-fade-in">
          <span className="text-base">✓</span>
          差分レビュー依頼を送信しました
        </div>
      )}

      {/* Table */}
      <div className="bg-bg-card rounded-xl border border-border overflow-hidden shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-cream/40">
              {["#", "原文名", "正規化候補", "アレルゲン", "出典ファイル", "状態", "操作"].map(
                (h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-left"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border-light last:border-0 hover:bg-bg-cream/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-text-muted tabular-nums">{row.id}</td>
                <td className="py-3 px-4 text-sm">{row.original}</td>
                <td className="py-3 px-4 text-sm">
                  <span className="font-medium text-primary">{row.normalized}</span>
                  {row.original !== row.normalized && (
                    <span className="text-[11px] text-text-muted ml-2">← 変換</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge value={row.allergen} />
                </td>
                <td className="py-3 px-4 text-sm text-text-muted">{row.sourceFile}</td>
                <td className="py-3 px-4">
                  <StatusBadge value={row.status} />
                </td>
                <td className="py-3 px-4">
                  {row.status === "要確認" ? (
                    <button
                      onClick={() => confirm(row.id)}
                      className="text-xs font-medium text-ok hover:text-ok/80 cursor-pointer"
                    >
                      確定 ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => revert(row.id)}
                      className="text-xs font-medium text-text-muted hover:text-text-secondary cursor-pointer"
                    >
                      戻す
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setReviewOpen(true)}
          className="px-5 py-2.5 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
        >
          差分レビュー依頼
        </button>
        <button
          className="px-5 py-2.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={pendingCount > 0}
        >
          承認してDB反映
        </button>
      </div>

      {/* Review Modal */}
      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="差分レビュー依頼">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-caution-bg border border-caution-border rounded-lg text-sm text-caution">
            <span>⚠</span>
            要確認項目: <strong>{pendingItems.length}件</strong>
          </div>

          <div className="bg-bg-cream/50 rounded-lg border border-border-light overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-cream/60">
                  <th className="py-2 px-3 text-left text-[11px] font-semibold text-text-muted uppercase">
                    原文名
                  </th>
                  <th className="py-2 px-3 text-left text-[11px] font-semibold text-text-muted uppercase">
                    正規化候補
                  </th>
                  <th className="py-2 px-3 text-left text-[11px] font-semibold text-text-muted uppercase">
                    アレルゲン
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingItems.map((item) => (
                  <tr key={item.id} className="border-b border-border-light last:border-0">
                    <td className="py-2 px-3">{item.original}</td>
                    <td className="py-2 px-3 font-medium text-primary">{item.normalized}</td>
                    <td className="py-2 px-3">
                      <StatusBadge value={item.allergen} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setReviewOpen(false)}
              className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={sendReview}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
            >
              レビュー依頼を送信
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
