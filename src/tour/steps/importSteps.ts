import type { Tour } from "../types";

export const importTour: Tour = {
  name: "import",
  steps: [
    {
      selector: "#import-upload-area",
      side: "bottom",
      title: "ファイル取込",
      content: "規格書やラベルをドラッグ&ドロップで取り込みます。",
    },
    {
      selector: "#import-filter-tabs",
      side: "bottom",
      title: "フィルタ",
      content: "ファイル種別でフィルタリングできます。",
    },
    {
      selector: "#import-queue-section",
      side: "top",
      title: "取込キュー",
      content: "アップロードしたファイルの処理状況が表示されます。",
    },
    {
      selector: "#import-normalize-section",
      side: "top",
      title: "正規化確認",
      content: "抽出された原材料とアレルゲンを確認し、確定してください。",
    },
  ],
};
