import { useState } from "react";
import { importQueue } from "../data/mock";
import { StatusBadge } from "../components/StatusBadge";

const filters = ["すべて", "PDF", "画像", "CSV", "Excel"] as const;
type Filter = (typeof filters)[number];

export function ImportPage() {
  const [active, setActive] = useState<Filter>("すべて");

  return (
    <div className="space-y-8 max-w-5xl">
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

        <div className="border-2 border-dashed border-border rounded-xl p-14 text-center bg-bg-cream/60 hover:border-primary/30 hover:bg-bg-cream transition-all duration-300 cursor-pointer group">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            📄
          </div>
          <p className="text-text-secondary font-medium mb-1">ファイルをドラッグ＆ドロップ</p>
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
          <span className="text-xs text-text-muted">{importQueue.length} 件</span>
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
              {importQueue.map((row) => (
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
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
