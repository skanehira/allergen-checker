import { useRef, useState } from "react";
import { importQueue, normalizationItems } from "../data/mock";
import type { ImportQueueItem, FileType, NormalizationItem } from "../data/mock";
import { StatusBadge } from "../components/StatusBadge";
import { Modal } from "../components/Modal";

const filters = ["すべて", "PDF", "画像", "CSV", "Excel"] as const;
type Filter = (typeof filters)[number];

const filterToFileType: Record<Exclude<Filter, "すべて">, FileType> = {
  PDF: "規格書",
  画像: "ラベル",
  CSV: "CSV",
  Excel: "Excel",
};

function guessFileType(fileName: string): FileType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "規格書";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "ラベル";
  if (ext === "csv") return "CSV";
  if (["xlsx", "xls"].includes(ext)) return "Excel";
  return "CSV";
}

let nextId = 200;

export function ImportPage() {
  const [active, setActive] = useState<Filter>("すべて");
  const [queue, setQueue] = useState<ImportQueueItem[]>(importQueue);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 正規化確認
  const [normItems, setNormItems] = useState<NormalizationItem[]>(normalizationItems);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  const displayed =
    active === "すべて"
      ? queue
      : queue.filter((item) => item.fileType === filterToFileType[active]);

  const pendingCount = normItems.filter((i) => i.status === "要確認").length;
  const pendingItems = normItems.filter((i) => i.status === "要確認");

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragging(false);
  }

  function addFiles(files: File[]) {
    const newItems: ImportQueueItem[] = files.map((file) => ({
      id: ++nextId,
      fileName: file.name,
      fileType: guessFileType(file.name),
      extractedCount: 0,
      status: "OCR中" as const,
    }));
    setQueue((prev) => [...prev, ...newItems]);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) addFiles(files);
    e.target.value = "";
  }

  function confirm(id: number) {
    setNormItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "確定" as const } : i)));
  }

  function revert(id: number) {
    setNormItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "要確認" as const } : i)),
    );
  }

  function sendReview() {
    setReviewOpen(false);
    setReviewSent(true);
    setTimeout(() => setReviewSent(false), 3000);
  }

  return (
    <div className="space-y-8">
      {/* Upload */}
      <section>
        <h3 className="font-display text-base font-medium text-text-secondary mb-4">
          ファイルアップロード
        </h3>

        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                active === f
                  ? "bg-primary text-white shadow-card"
                  : "bg-bg-card text-text-secondary border border-border hover:border-primary/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-14 text-center transition-all duration-300 cursor-pointer group ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-bg-cream/60 hover:border-primary/30 hover:bg-bg-cream"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {dragging ? "📥" : "📄"}
          </div>
          <p className="text-text-secondary font-medium mb-1">
            {dragging ? "ここにドロップしてアップロード" : "ファイルをドラッグ＆ドロップ"}
          </p>
          <p className="text-text-muted text-sm">
            または <span className="text-primary underline cursor-pointer">参照</span>{" "}
            してアップロード
          </p>
          <p className="text-text-muted text-[11px] mt-3">PDF, JPG, PNG, CSV, XLSX に対応</p>
        </div>
      </section>

      {/* Queue */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-medium text-text-secondary">取込キュー</h3>
          <span className="text-xs text-text-muted">{displayed.length} 件</span>
        </div>

        <div className="bg-bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-cream/40">
                {["ID", "ファイル名", "種別", "抽出件数", "状態", "操作"].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider ${
                      i === 3 ? "text-right" : i >= 4 ? "text-center" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border-light last:border-0 hover:bg-bg-cream/30 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-text-muted tabular-nums">{row.id}</td>
                  <td className="py-3 px-4 text-sm font-medium">{row.fileName}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{row.fileType}</td>
                  <td className="py-3 px-4 text-sm text-right tabular-nums">
                    {row.extractedCount || "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge value={row.status} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.status === "抽出済み" && (
                      <button className="text-xs text-primary hover:text-primary-dark font-medium cursor-pointer">
                        正規化へ →
                      </button>
                    )}
                    {row.status === "OCR中" && (
                      <button className="text-xs text-text-muted hover:text-text-secondary font-medium cursor-pointer">
                        再実行
                      </button>
                    )}
                    {row.status === "エラー" && (
                      <button className="text-xs text-ng hover:text-ng/80 font-medium cursor-pointer">
                        再試行
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-text-muted">
                    該当するファイルがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Normalization */}
      <section className="space-y-6">
        <h3 className="font-display text-base font-medium text-text-secondary">正規化確認</h3>

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
              {normItems.map((row) => (
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
      </section>
    </div>
  );
}
